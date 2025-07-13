# Automated Data Collection & Integration Guide

This guide explains how to collect automation attributes from various endpoints and automatically populate the database on a periodic basis for specific AIR IDs.

## 📋 Table of Contents

- [Overview](#overview)
- [Data Sources & Endpoints](#data-sources--endpoints)
- [Collection Strategies](#collection-strategies)
- [Implementation Examples](#implementation-examples)
- [Scheduling & Automation](#scheduling--automation)
- [Data Mapping & Transformation](#data-mapping--transformation)
- [Error Handling & Monitoring](#error-handling--monitoring)
- [Best Practices](#best-practices)

## 🎯 Overview

The automation database can be populated from multiple data sources by collecting information for specific AIR IDs and posting them to the appropriate endpoints. This enables automatic synchronization of automation data from various systems.

### Available Database Endpoints

| Endpoint | Purpose | Method | Data Type |
|----------|---------|--------|-----------|
| `/automations` | Main automation records | POST/PATCH | Core automation info |
| `/artifacts` | Links and deliverables | POST/PATCH | Artifacts and demos |
| `/environments` | Deployment environments | POST/PATCH | Environment configs |
| `/metrics` | Performance metrics | POST/PATCH | KPIs and statistics |
| `/people` | Team assignments | POST/PATCH | Roles and responsibilities |
| `/tools` | Tool information | POST/PATCH | Software and versions |

## 🔗 Data Sources & Endpoints

### Common Data Sources

1. **CI/CD Systems** (Jenkins, Azure DevOps, GitHub Actions)
2. **Project Management Tools** (Jira, Azure Boards, ServiceNow)
3. **Code Repositories** (GitHub, GitLab, Azure Repos)
4. **Deployment Systems** (Kubernetes, Docker, Cloud Platforms)
5. **Monitoring Tools** (Prometheus, Grafana, Application Insights)
6. **Documentation Systems** (Confluence, SharePoint, Wiki)

### Example Data Collection Points

```javascript
// Example data sources configuration
const dataSources = {
  jenkins: {
    baseUrl: 'https://jenkins.company.com',
    endpoints: {
      builds: '/job/{air_id}/api/json',
      artifacts: '/job/{air_id}/lastSuccessfulBuild/artifact/',
      metrics: '/job/{air_id}/buildHistory/api/json'
    }
  },
  jira: {
    baseUrl: 'https://company.atlassian.net',
    endpoints: {
      issues: '/rest/api/2/search?jql=project=AUTO AND labels={air_id}',
      deployments: '/rest/api/2/issue/{air_id}/transitions'
    }
  },
  github: {
    baseUrl: 'https://api.github.com',
    endpoints: {
      repo: '/repos/company/{air_id}',
      releases: '/repos/company/{air_id}/releases',
      workflows: '/repos/company/{air_id}/actions/runs'
    }
  }
};
```

## 🔄 Collection Strategies

### 1. **Pull-based Collection** (Recommended)
Periodically fetch data from external systems and update the database.

### 2. **Push-based Collection**
External systems push data to your API endpoints via webhooks.

### 3. **Hybrid Approach**
Combine both strategies for different data types.

## 💻 Implementation Examples

### Basic Data Collector Class

```javascript
// data-collector.js
class AutomationDataCollector {
  constructor(config) {
    this.config = config;
    this.baseUrl = 'http://localhost:5000'; // Your backend URL
  }

  async collectForAirId(airId) {
    console.log(`Collecting data for AIR ID: ${airId}`);
    
    try {
      // Collect from multiple sources
      const [automation, artifacts, metrics, environments] = await Promise.all([
        this.collectAutomationData(airId),
        this.collectArtifacts(airId),
        this.collectMetrics(airId),
        this.collectEnvironments(airId)
      ]);

      // Update database
      await this.updateDatabase(airId, {
        automation,
        artifacts,
        metrics,
        environments
      });

      console.log(`Successfully updated data for ${airId}`);
    } catch (error) {
      console.error(`Error collecting data for ${airId}:`, error);
      throw error;
    }
  }

  async collectAutomationData(airId) {
    // Collect from Jenkins
    const jenkinsData = await this.fetchFromJenkins(airId);
    
    // Collect from Jira
    const jiraData = await this.fetchFromJira(airId);
    
    // Collect from GitHub
    const githubData = await this.fetchFromGitHub(airId);

    // Merge and transform data
    return this.mergeAutomationData(jenkinsData, jiraData, githubData);
  }

  async fetchFromJenkins(airId) {
    const url = `${this.config.jenkins.baseUrl}/job/${airId}/api/json`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${this.config.jenkins.token}`
      }
    });
    return response.json();
  }

  async fetchFromJira(airId) {
    const url = `${this.config.jira.baseUrl}/rest/api/2/search?jql=project=AUTO AND labels=${airId}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${this.config.jira.token}`
      }
    });
    return response.json();
  }

  async fetchFromGitHub(airId) {
    const url = `${this.config.github.baseUrl}/repos/company/${airId}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${this.config.github.token}`
      }
    });
    return response.json();
  }

  mergeAutomationData(jenkinsData, jiraData, githubData) {
    return {
      name: githubData.name || jenkinsData.displayName,
      type: this.extractType(jiraData),
      brief_description: githubData.description,
      complexity: this.assessComplexity(githubData, jenkinsData),
      tool_version: this.extractToolVersion(jenkinsData),
      process_details: this.extractProcessDetails(jiraData),
      documentation: githubData.html_url + '/README.md',
      // Add more field mappings as needed
    };
  }

  async updateDatabase(airId, data) {
    // Update main automation record
    if (data.automation) {
      await this.updateAutomation(airId, data.automation);
    }

    // Update artifacts
    if (data.artifacts) {
      await this.updateArtifacts(airId, data.artifacts);
    }

    // Update metrics
    if (data.metrics) {
      await this.updateMetrics(airId, data.metrics);
    }

    // Update environments
    if (data.environments) {
      await this.updateEnvironments(airId, data.environments);
    }
  }

  async updateAutomation(airId, automationData) {
    const url = `${this.baseUrl}/automations/${airId}`;
    
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(automationData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update automation ${airId}: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error updating automation ${airId}:`, error);
      throw error;
    }
  }

  async updateArtifacts(airId, artifactsData) {
    // Check if artifacts already exist
    const existingResponse = await fetch(`${this.baseUrl}/artifacts?automation_id=${airId}`);
    const existing = await existingResponse.json();

    if (existing.length > 0) {
      // Update existing
      const url = `${this.baseUrl}/artifacts/${existing[0].id}`;
      return fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artifactsData)
      });
    } else {
      // Create new
      const url = `${this.baseUrl}/artifacts`;
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ automation_id: airId, ...artifactsData })
      });
    }
  }
}
```

### Data Collection Configuration

```javascript
// config/data-sources.js
export const dataSourceConfig = {
  jenkins: {
    baseUrl: process.env.JENKINS_URL || 'https://jenkins.company.com',
    token: process.env.JENKINS_TOKEN,
    enabled: true
  },
  jira: {
    baseUrl: process.env.JIRA_URL || 'https://company.atlassian.net',
    token: process.env.JIRA_TOKEN,
    enabled: true
  },
  github: {
    baseUrl: process.env.GITHUB_API_URL || 'https://api.github.com',
    token: process.env.GITHUB_TOKEN,
    enabled: true
  },
  azure: {
    baseUrl: process.env.AZURE_DEVOPS_URL,
    token: process.env.AZURE_TOKEN,
    enabled: false
  }
};

// List of AIR IDs to monitor
export const monitoredAirIds = [
  'AIR-001',
  'AIR-002',
  'AIR-003',
  'AIR-004',
  'AIR-005'
];
```

### Specific Data Mappers

```javascript
// mappers/jenkins-mapper.js
export class JenkinsMapper {
  static mapToAutomation(jenkinsData) {
    return {
      name: jenkinsData.displayName,
      type: this.extractType(jenkinsData.description),
      tool_version: this.extractToolVersion(jenkinsData),
      queue: jenkinsData.name,
      modified: new Date(jenkinsData.lastBuild?.timestamp).toISOString(),
    };
  }

  static mapToArtifacts(jenkinsData) {
    return {
      artifacts_link: `${jenkinsData.url}lastSuccessfulBuild/artifact/`,
      code_review: jenkinsData.lastBuild?.result === 'SUCCESS' ? 'Passed' : 'Failed',
      demo: jenkinsData.lastSuccessfulBuild ? 'Available' : 'Not Available'
    };
  }

  static mapToMetrics(jenkinsData) {
    return {
      build_success_rate: this.calculateSuccessRate(jenkinsData.builds),
      average_build_time: this.calculateAverageBuildTime(jenkinsData.builds),
      last_build_status: jenkinsData.lastBuild?.result
    };
  }
}

// mappers/github-mapper.js
export class GitHubMapper {
  static mapToAutomation(repoData) {
    return {
      name: repoData.name,
      brief_description: repoData.description,
      documentation: `${repoData.html_url}/README.md`,
      path: repoData.clone_url,
      modified: repoData.updated_at
    };
  }

  static mapToArtifacts(repoData, releases) {
    const latestRelease = releases[0];
    return {
      artifacts_link: repoData.html_url,
      demo: latestRelease ? `${latestRelease.html_url}` : null,
      rampup_issue_list: `${repoData.html_url}/issues?q=is%3Aissue+label%3Arampup`
    };
  }
}
```

## ⏰ Scheduling & Automation

### Using Node.js Cron Jobs

```javascript
// scheduler.js
import cron from 'node-cron';
import { AutomationDataCollector } from './data-collector.js';
import { dataSourceConfig, monitoredAirIds } from './config/data-sources.js';

const collector = new AutomationDataCollector(dataSourceConfig);

// Daily collection at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Starting daily data collection...');
  
  for (const airId of monitoredAirIds) {
    try {
      await collector.collectForAirId(airId);
      console.log(`✅ Completed collection for ${airId}`);
    } catch (error) {
      console.error(`❌ Failed collection for ${airId}:`, error.message);
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('Daily data collection completed');
});

// Hourly metrics collection
cron.schedule('0 * * * *', async () => {
  console.log('Collecting hourly metrics...');
  
  for (const airId of monitoredAirIds) {
    try {
      await collector.collectMetrics(airId);
    } catch (error) {
      console.error(`Failed metrics collection for ${airId}:`, error.message);
    }
  }
});

console.log('Data collection scheduler started');
```

### Using GitHub Actions

```yaml
# .github/workflows/data-collection.yml
name: Automated Data Collection

on:
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  collect-data:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Run data collection
      env:
        JENKINS_TOKEN: ${{ secrets.JENKINS_TOKEN }}
        JIRA_TOKEN: ${{ secrets.JIRA_TOKEN }}
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
      run: node scripts/collect-data.js
```

### Using Docker & Docker Compose

```dockerfile
# Dockerfile.collector
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "scheduler.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  automation-backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./automation_database.db:/app/automation_database.db

  data-collector:
    build: 
      context: .
      dockerfile: Dockerfile.collector
    environment:
      - JENKINS_TOKEN=${JENKINS_TOKEN}
      - JIRA_TOKEN=${JIRA_TOKEN}
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - DATABASE_URL=http://automation-backend:5000
    depends_on:
      - automation-backend
    restart: unless-stopped
```

## 🔄 Data Mapping & Transformation

### Field Mapping Configuration

```javascript
// config/field-mappings.js
export const fieldMappings = {
  jenkins: {
    automation: {
      'displayName': 'name',
      'description': 'brief_description',
      'lastBuild.timestamp': 'modified',
      'name': 'queue'
    },
    artifacts: {
      'url': 'artifacts_link',
      'lastBuild.result': (result) => result === 'SUCCESS' ? 'Passed' : 'Failed'
    }
  },
  
  jira: {
    automation: {
      'fields.summary': 'name',
      'fields.description': 'brief_description',
      'fields.customfield_10001': 'complexity',
      'fields.assignee.displayName': 'assigned_to'
    }
  },
  
  github: {
    automation: {
      'name': 'name',
      'description': 'brief_description',
      'html_url': 'documentation',
      'clone_url': 'path',
      'updated_at': 'modified'
    },
    artifacts: {
      'html_url': 'artifacts_link',
      'releases[0].html_url': 'demo'
    }
  }
};
```

### Data Transformation Utilities

```javascript
// utils/transformers.js
export class DataTransformers {
  static transformComplexity(description, linesOfCode, dependencies) {
    if (linesOfCode > 10000 || dependencies > 50) return 'High';
    if (linesOfCode > 1000 || dependencies > 10) return 'Medium';
    return 'Low';
  }

  static extractType(description, repoTopics) {
    const keywords = {
      'RPA': ['robot', 'automation', 'rpa', 'uipath', 'automation anywhere'],
      'Data Processing': ['etl', 'data', 'processing', 'pipeline'],
      'Workflow': ['workflow', 'process', 'orchestration'],
      'API': ['api', 'rest', 'graphql', 'service']
    };

    const text = (description + ' ' + repoTopics?.join(' ')).toLowerCase();
    
    for (const [type, terms] of Object.entries(keywords)) {
      if (terms.some(term => text.includes(term))) {
        return type;
      }
    }
    
    return 'Other';
  }

  static formatDate(timestamp) {
    return new Date(timestamp).toISOString().split('T')[0];
  }

  static sanitizeText(text) {
    return text?.replace(/[^\w\s-.,]/g, '').trim().substring(0, 500);
  }
}
```

## 🚨 Error Handling & Monitoring

### Error Handling Strategy

```javascript
// utils/error-handler.js
export class ErrorHandler {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  async handleError(error, context) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      context,
      error: error.message,
      stack: error.stack
    };

    this.errors.push(errorInfo);
    
    // Log to console
    console.error(`[${context}] ${error.message}`);
    
    // Send to monitoring system
    await this.sendToMonitoring(errorInfo);
    
    // Determine if this is a retryable error
    if (this.isRetryable(error)) {
      return { retry: true, delay: this.getRetryDelay(error) };
    }
    
    return { retry: false };
  }

  isRetryable(error) {
    const retryableErrors = [
      'ECONNRESET',
      'ETIMEDOUT',
      'ENOTFOUND',
      'Rate limit exceeded'
    ];
    
    return retryableErrors.some(retryable => 
      error.message.includes(retryable)
    );
  }

  getRetryDelay(error) {
    if (error.message.includes('Rate limit')) return 60000; // 1 minute
    return 5000; // 5 seconds
  }

  async sendToMonitoring(errorInfo) {
    // Send to your monitoring system (e.g., Slack, email, etc.)
    try {
      await fetch(process.env.MONITORING_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `Data Collection Error: ${errorInfo.context} - ${errorInfo.error}`
        })
      });
    } catch (monitoringError) {
      console.error('Failed to send error to monitoring:', monitoringError);
    }
  }
}
```

### Health Check Endpoint

```javascript
// Add to your backend (backend/src/health/health.controller.ts)
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      lastDataCollection: this.getLastCollectionTime()
    };
  }

  @Get('collection-status')
  getCollectionStatus() {
    return {
      lastRun: this.getLastCollectionTime(),
      nextRun: this.getNextCollectionTime(),
      successRate: this.getSuccessRate(),
      errors: this.getRecentErrors()
    };
  }
}
```

## 🎯 Best Practices

### 1. **Rate Limiting & Throttling**
```javascript
// Add delays between API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Respect rate limits
const rateLimiter = {
  github: { requests: 0, resetTime: 0, limit: 5000 },
  jira: { requests: 0, resetTime: 0, limit: 100 }
};
```

### 2. **Caching Strategy**
```javascript
// Cache expensive API calls
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function cachedFetch(url, options) {
  const cacheKey = `${url}:${JSON.stringify(options)}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await fetch(url, options);
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}
```

### 3. **Configuration Management**
```javascript
// config/environment.js
export const config = {
  development: {
    collectInterval: '*/5 * * * *', // Every 5 minutes
    logLevel: 'debug',
    retryAttempts: 3
  },
  production: {
    collectInterval: '0 2 * * *', // Daily at 2 AM
    logLevel: 'info',
    retryAttempts: 5
  }
};
```

### 4. **Data Validation**
```javascript
// validators/automation-validator.js
export function validateAutomationData(data) {
  const errors = [];
  
  if (!data.air_id || data.air_id.length === 0) {
    errors.push('AIR ID is required');
  }
  
  if (!data.name || data.name.length === 0) {
    errors.push('Name is required');
  }
  
  if (data.complexity && !['Low', 'Medium', 'High'].includes(data.complexity)) {
    errors.push('Invalid complexity value');
  }
  
  return { isValid: errors.length === 0, errors };
}
```

## 🚀 Quick Start Script

Create a simple script to get started:

```javascript
// scripts/quick-start.js
import { AutomationDataCollector } from '../data-collector.js';

const config = {
  github: {
    baseUrl: 'https://api.github.com',
    token: process.env.GITHUB_TOKEN
  }
};

const collector = new AutomationDataCollector(config);

// Test with a single AIR ID
async function testCollection() {
  try {
    await collector.collectForAirId('AIR-001');
    console.log('✅ Test collection completed successfully');
  } catch (error) {
    console.error('❌ Test collection failed:', error);
  }
}

testCollection();
```

Run with:
```bash
GITHUB_TOKEN=your_token node scripts/quick-start.js
```

This guide provides a comprehensive framework for automatically collecting and updating automation data from multiple sources. Adapt the examples to your specific data sources and requirements.
