# Automation Database System

A comprehensive database system for managing automation records and workflows. Built with Next.js frontend, NestJS backend, and PostgreSQL database.

## 🏗️ Architecture

### Frontend (Next.js)
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Headless UI, Heroicons
- **Features**: 
  - Clean table view with essential columns (AIR ID, Name, Type, Complexity, Description)
  - Detailed sidebar with grouped information
  - Search functionality
  - Responsive design

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Features**:
  - RESTful API endpoints
  - Swagger documentation
  - Data validation with class-validator
  - Fuzzy search with pg_trgm
  - Normalized database structure

### Database Schema
The database is normalized into several tables:
- `automations` - Main automation records
- `tools` - Automation tools (UiPath, Power Automate, etc.)
- `people` - Personnel involved in automations
- `automation_people_roles` - Many-to-many relationship for people and their roles
- `environments` - Dev/QA/Prod environment configurations
- `metrics` - Performance metrics and success rates
- `artifacts` - Links to documentation and artifacts
- `test_data` - Test data information

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- Git

### 1. Database Setup
```bash
# Create database
createdb automation_db

# Run the schema script
psql -d automation_db -f database/schema.sql
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment file
cp .env.example .env

# Update database credentials in .env
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=your_password
# DB_NAME=automation_db

# Start the backend server
npm run start:dev
```

### 3. Frontend Setup
```bash
cd ../  # Go back to root
npm install

# Start the development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api

## 📊 Features

### Main Table View
- Essential columns: AIR ID, Name, Type, Complexity, Description
- Color-coded complexity indicators
- Search functionality
- Responsive design

### Detailed Sidebar
Information is logically grouped into sections:
- **Basic Information**: Type, COE/FED, Complexity, Description
- **Tool Information**: Tool, Version, Process Details
- **People & Roles**: Project Manager, Developer, Tester, Business SPOC
- **Environment Details**: Dev, QA, Prod configurations
- **Infrastructure**: Queue, Shared Folders, Mailboxes
- **Timeline**: Deployment dates, Warranty information
- **Performance Metrics**: Success rates, Case counts
- **Quality Assurance**: QA handshake, Test data SPOC
- **Artifacts & Links**: Documentation, Code review status
- **Comments & Documentation**: Additional notes

## 🔧 API Endpoints

### Automations
- `GET /automations` - Get all automations
- `GET /automations/:air_id` - Get specific automation
- `GET /automations/search?q=term` - Search automations
- `POST /automations` - Create new automation
- `PATCH /automations/:air_id` - Update automation
- `DELETE /automations/:air_id` - Delete automation

## 🛠️ Development Commands

### Frontend
```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm run start

# Lint
npm run lint
```

### Backend
```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Testing
npm run test
```

---

**Built with ❤️ for efficient automation management**
