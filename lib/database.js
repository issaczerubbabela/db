import Database from 'better-sqlite3';
import path from 'path';

let db;

export function getDatabase() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'automation_database.db');
    db = new Database(dbPath);
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Initialize the database with tables if they don't exist
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  const database = getDatabase();
  
  // Create automations table
  database.exec(`
    CREATE TABLE IF NOT EXISTS automations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      air_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      brief_description TEXT,
      coe_fed TEXT,
      complexity TEXT,
      tool TEXT,
      tool_version TEXT,
      process_details TEXT,
      object_details TEXT,
      queue TEXT,
      shared_folders TEXT,
      shared_mailboxes TEXT,
      qa_handshake TEXT,
      preprod_deploy_date TEXT,
      prod_deploy_date TEXT,
      warranty_end_date TEXT,
      comments TEXT,
      documentation TEXT,
      modified TEXT,
      modified_by TEXT,
      path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create people table
  database.exec(`
    CREATE TABLE IF NOT EXISTS automation_people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      automation_id INTEGER,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      FOREIGN KEY (automation_id) REFERENCES automations (id) ON DELETE CASCADE
    )
  `);

  // Create environments table
  database.exec(`
    CREATE TABLE IF NOT EXISTS automation_environments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      automation_id INTEGER,
      type TEXT NOT NULL,
      vdi TEXT,
      service_account TEXT,
      FOREIGN KEY (automation_id) REFERENCES automations (id) ON DELETE CASCADE
    )
  `);

  // Create test_data table
  database.exec(`
    CREATE TABLE IF NOT EXISTS automation_test_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      automation_id INTEGER,
      spoc TEXT,
      FOREIGN KEY (automation_id) REFERENCES automations (id) ON DELETE CASCADE
    )
  `);

  // Create metrics table
  database.exec(`
    CREATE TABLE IF NOT EXISTS automation_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      automation_id INTEGER,
      post_prod_total_cases INTEGER,
      post_prod_sys_ex_count INTEGER,
      post_prod_success_rate REAL,
      FOREIGN KEY (automation_id) REFERENCES automations (id) ON DELETE CASCADE
    )
  `);

  // Create artifacts table
  database.exec(`
    CREATE TABLE IF NOT EXISTS automation_artifacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      automation_id INTEGER,
      artifacts_link TEXT,
      code_review TEXT,
      demo TEXT,
      rampup_issue_list TEXT,
      FOREIGN KEY (automation_id) REFERENCES automations (id) ON DELETE CASCADE
    )
  `);
}

export function getAllAutomations() {
  const database = getDatabase();
  const automations = database.prepare(`
    SELECT *, rowid FROM automations ORDER BY created_at DESC
  `).all();

  return automations.map(automation => ({
    ...automation,
    people: getPeopleByAutomationId(automation.rowid),
    environments: getEnvironmentsByAutomationId(automation.rowid),
    test_data: getTestDataByAutomationId(automation.rowid),
    metrics: getMetricsByAutomationId(automation.rowid),
    artifacts: getArtifactsByAutomationId(automation.rowid)
  }));
}

export function getAutomationById(id) {
  const database = getDatabase();
  const automation = database.prepare('SELECT *, rowid FROM automations WHERE rowid = ?').get(id);
  
  if (!automation) return null;

  return {
    ...automation,
    people: getPeopleByAutomationId(automation.rowid),
    environments: getEnvironmentsByAutomationId(automation.rowid),
    test_data: getTestDataByAutomationId(automation.rowid),
    metrics: getMetricsByAutomationId(automation.rowid),
    artifacts: getArtifactsByAutomationId(automation.rowid)
  };
}

export function createAutomation(automationData) {
  const database = getDatabase();
  const {
    people = [],
    environments = [],
    test_data = {},
    metrics = {},
    artifacts = {},
    ...automation
  } = automationData;

  // Start transaction
  const transaction = database.transaction(() => {
    // Insert automation with the correct schema
    const result = database.prepare(`
      INSERT INTO automations (
        air_id, name, type, brief_description, coe_fed, complexity, tool_version,
        process_details, object_details, queue, shared_folders, shared_mailboxes,
        qa_handshake, preprod_deploy_date, prod_deploy_date, warranty_end_date,
        comments, documentation, modified, path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      automation.air_id, 
      automation.name, 
      automation.type, 
      automation.brief_description,
      automation.coe_fed, 
      automation.complexity, 
      automation.tool_version,
      automation.process_details, 
      automation.object_details, 
      automation.queue,
      automation.shared_folders, 
      automation.shared_mailboxes, 
      automation.qa_handshake,
      automation.preprod_deploy_date, 
      automation.prod_deploy_date, 
      automation.warranty_end_date,
      automation.comments, 
      automation.documentation, 
      automation.modified, 
      automation.path
    );

    return automation.air_id;
  });

  const airId = transaction();
  
  // Return the created automation with the air_id
  const createdAutomation = database.prepare('SELECT * FROM automations WHERE air_id = ?').get(airId);
  return {
    ...createdAutomation,
    people: [],
    environments: [],
    test_data: {},
    metrics: {},
    artifacts: {}
  };
}

export function deleteAutomation(airId) {
  const database = getDatabase();
  
  const transaction = database.transaction(() => {
    // First, get the rowid of the automation (this is what the foreign keys actually reference)
    const automation = database.prepare('SELECT rowid FROM automations WHERE air_id = ?').get(airId);
    if (!automation) {
      throw new Error(`Automation with AIR ID ${airId} not found`);
    }
    
    const automationRowId = automation.rowid;
    
    // Delete related records using the rowid
    try {
      database.prepare('DELETE FROM automation_people WHERE automation_id = ?').run(automationRowId);
    } catch (e) {
      console.warn('Could not delete from automation_people:', e.message);
    }
    
    try {
      database.prepare('DELETE FROM automation_environments WHERE automation_id = ?').run(automationRowId);
    } catch (e) {
      console.warn('Could not delete from automation_environments:', e.message);
    }
    
    try {
      database.prepare('DELETE FROM automation_test_data WHERE automation_id = ?').run(automationRowId);
    } catch (e) {
      console.warn('Could not delete from automation_test_data:', e.message);
    }
    
    try {
      database.prepare('DELETE FROM automation_metrics WHERE automation_id = ?').run(automationRowId);
    } catch (e) {
      console.warn('Could not delete from automation_metrics:', e.message);
    }
    
    try {
      database.prepare('DELETE FROM automation_artifacts WHERE automation_id = ?').run(automationRowId);
    } catch (e) {
      console.warn('Could not delete from automation_artifacts:', e.message);
    }
    
    // Delete the main automation record
    const result = database.prepare('DELETE FROM automations WHERE air_id = ?').run(airId);
    
    if (result.changes === 0) {
      throw new Error(`Failed to delete automation with AIR ID ${airId}`);
    }
    
    return result.changes;
  });
  
  return transaction();
}

// Helper functions
function getPeopleByAutomationId(automationId) {
  const database = getDatabase();
  return database.prepare('SELECT * FROM automation_people WHERE automation_id = ?').all(automationId);
}

function getEnvironmentsByAutomationId(automationId) {
  const database = getDatabase();
  return database.prepare('SELECT * FROM automation_environments WHERE automation_id = ?').all(automationId);
}

function getTestDataByAutomationId(automationId) {
  const database = getDatabase();
  const result = database.prepare('SELECT * FROM automation_test_data WHERE automation_id = ?').get(automationId);
  return result || {};
}

function getMetricsByAutomationId(automationId) {
  const database = getDatabase();
  const result = database.prepare('SELECT * FROM automation_metrics WHERE automation_id = ?').get(automationId);
  return result || {};
}

function getArtifactsByAutomationId(automationId) {
  const database = getDatabase();
  const result = database.prepare('SELECT * FROM automation_artifacts WHERE automation_id = ?').get(automationId);
  return result || {};
}

function insertPeople(automationId, people) {
  const database = getDatabase();
  const insertPerson = database.prepare('INSERT INTO automation_people (automation_id, name, role) VALUES (?, ?, ?)');
  people.forEach(person => insertPerson.run(automationId, person.name, person.role));
}

function insertEnvironments(automationId, environments) {
  const database = getDatabase();
  const insertEnv = database.prepare('INSERT INTO automation_environments (automation_id, type, vdi, service_account) VALUES (?, ?, ?, ?)');
  environments.forEach(env => insertEnv.run(automationId, env.type, env.vdi, env.service_account));
}

function insertTestData(automationId, testData) {
  const database = getDatabase();
  if (testData.spoc) {
    database.prepare('INSERT INTO automation_test_data (automation_id, spoc) VALUES (?, ?)').run(automationId, testData.spoc);
  }
}

function insertMetrics(automationId, metrics) {
  const database = getDatabase();
  if (Object.keys(metrics).length > 0) {
    database.prepare(`
      INSERT INTO automation_metrics (automation_id, post_prod_total_cases, post_prod_sys_ex_count, post_prod_success_rate)
      VALUES (?, ?, ?, ?)
    `).run(automationId, metrics.post_prod_total_cases, metrics.post_prod_sys_ex_count, metrics.post_prod_success_rate);
  }
}

function insertArtifacts(automationId, artifacts) {
  const database = getDatabase();
  if (Object.keys(artifacts).length > 0) {
    database.prepare(`
      INSERT INTO automation_artifacts (automation_id, artifacts_link, code_review, demo, rampup_issue_list)
      VALUES (?, ?, ?, ?, ?)
    `).run(automationId, artifacts.artifacts_link, artifacts.code_review, artifacts.demo, artifacts.rampup_issue_list);
  }
}
