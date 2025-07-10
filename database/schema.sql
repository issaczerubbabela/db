-- Automation Database Schema
-- PostgreSQL with pg_trgm extension for fuzzy search

-- Enable pg_trgm extension for text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create tools table
CREATE TABLE tools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create people table
CREATE TABLE people (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(300),
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create automations table (main table)
CREATE TABLE automations (
    air_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    type VARCHAR(100) NOT NULL,
    brief_description TEXT,
    coe_fed VARCHAR(10) CHECK (coe_fed IN ('COE', 'FED')),
    complexity VARCHAR(20) CHECK (complexity IN ('Low', 'Medium', 'High')),
    tool_id INTEGER REFERENCES tools(id),
    tool_version VARCHAR(50),
    process_details TEXT,
    object_details TEXT,
    queue VARCHAR(200),
    shared_folders TEXT,
    shared_mailboxes VARCHAR(500),
    qa_handshake VARCHAR(50),
    preprod_deploy_date DATE,
    prod_deploy_date DATE,
    warranty_end_date DATE,
    comments TEXT,
    documentation TEXT,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_by_id INTEGER REFERENCES people(id),
    path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create automation_people_roles table (many-to-many relationship)
CREATE TABLE automation_people_roles (
    id SERIAL PRIMARY KEY,
    automation_id VARCHAR(20) REFERENCES automations(air_id) ON DELETE CASCADE,
    person_id INTEGER REFERENCES people(id),
    role VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(automation_id, person_id, role)
);

-- Create environments table
CREATE TABLE environments (
    id SERIAL PRIMARY KEY,
    automation_id VARCHAR(20) REFERENCES automations(air_id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Dev', 'QA', 'Prod')),
    vdi VARCHAR(100),
    service_account VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(automation_id, type)
);

-- Create test_data table
CREATE TABLE test_data (
    id SERIAL PRIMARY KEY,
    automation_id VARCHAR(20) REFERENCES automations(air_id) ON DELETE CASCADE,
    spoc_id INTEGER REFERENCES people(id),
    data_location TEXT,
    data_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create metrics table
CREATE TABLE metrics (
    id SERIAL PRIMARY KEY,
    automation_id VARCHAR(20) REFERENCES automations(air_id) ON DELETE CASCADE,
    post_prod_total_cases INTEGER DEFAULT 0,
    post_prod_sys_ex_count INTEGER DEFAULT 0,
    post_prod_success_rate DECIMAL(5,2) DEFAULT 0.00,
    measurement_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create artifacts table
CREATE TABLE artifacts (
    id SERIAL PRIMARY KEY,
    automation_id VARCHAR(20) REFERENCES automations(air_id) ON DELETE CASCADE,
    artifacts_link TEXT,
    code_review VARCHAR(50),
    demo VARCHAR(50),
    rampup_issue_list TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_automations_name ON automations USING gin (name gin_trgm_ops);
CREATE INDEX idx_automations_type ON automations(type);
CREATE INDEX idx_automations_complexity ON automations(complexity);
CREATE INDEX idx_automations_coe_fed ON automations(coe_fed);
CREATE INDEX idx_automations_tool_id ON automations(tool_id);
CREATE INDEX idx_automations_modified ON automations(modified);
CREATE INDEX idx_automation_people_roles_automation_id ON automation_people_roles(automation_id);
CREATE INDEX idx_automation_people_roles_person_id ON automation_people_roles(person_id);
CREATE INDEX idx_automation_people_roles_role ON automation_people_roles(role);
CREATE INDEX idx_environments_automation_id ON environments(automation_id);
CREATE INDEX idx_environments_type ON environments(type);
CREATE INDEX idx_metrics_automation_id ON metrics(automation_id);
CREATE INDEX idx_artifacts_automation_id ON artifacts(automation_id);

-- Create a full-text search index
CREATE INDEX idx_automations_search ON automations USING gin (
    (name || ' ' || type || ' ' || COALESCE(brief_description, '')) gin_trgm_ops
);

-- Create triggers for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON automations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON people FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_environments_updated_at BEFORE UPDATE ON environments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_test_data_updated_at BEFORE UPDATE ON test_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_metrics_updated_at BEFORE UPDATE ON metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artifacts_updated_at BEFORE UPDATE ON artifacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample tools
INSERT INTO tools (name) VALUES
    ('UiPath'),
    ('Power Automate'),
    ('Automation Anywhere'),
    ('Blue Prism'),
    ('WorkFusion'),
    ('Pega'),
    ('Kofax'),
    ('NICE');

-- Insert sample people
INSERT INTO people (name, email, department) VALUES
    ('John Doe', 'john.doe@company.com', 'IT'),
    ('Jane Smith', 'jane.smith@company.com', 'HR'),
    ('Alice Johnson', 'alice.johnson@company.com', 'Finance'),
    ('Bob Smith', 'bob.smith@company.com', 'IT'),
    ('Carol Davis', 'carol.davis@company.com', 'QA'),
    ('Diana Wilson', 'diana.wilson@company.com', 'Business'),
    ('Michael Brown', 'michael.brown@company.com', 'IT'),
    ('Sarah Johnson', 'sarah.johnson@company.com', 'IT'),
    ('Tom Wilson', 'tom.wilson@company.com', 'QA'),
    ('Lisa Anderson', 'lisa.anderson@company.com', 'HR'),
    ('Emily Davis', 'emily.davis@company.com', 'Finance'),
    ('Chris Miller', 'chris.miller@company.com', 'IT'),
    ('Ashley Taylor', 'ashley.taylor@company.com', 'QA'),
    ('Mark Thompson', 'mark.thompson@company.com', 'Finance'),
    ('Robert Johnson', 'robert.johnson@company.com', 'IT');

-- Insert sample automations
INSERT INTO automations (air_id, name, type, brief_description, coe_fed, complexity, tool_id, tool_version, process_details, object_details, queue, shared_folders, shared_mailboxes, qa_handshake, preprod_deploy_date, prod_deploy_date, warranty_end_date, comments, documentation, modified_by_id, path) VALUES
    ('AIR-001', 'Invoice Processing Automation', 'Document Processing', 'Automates the processing of vendor invoices from receipt to approval', 'COE', 'Medium', 1, '2023.10', 'Extracts data from PDF invoices, validates against purchase orders, and routes for approval', 'Invoice objects, PO validation, approval workflow', 'Invoice_Processing_Queue', '\\shared\invoices', 'invoices@company.com', 'Completed', '2024-01-15', '2024-02-01', '2024-08-01', 'High priority automation for finance team', 'Process documentation available in SharePoint', 1, '\\automation\projects\invoice_processing'),
    ('AIR-002', 'Employee Onboarding Automation', 'HR Process', 'Automates new employee setup including account creation and system access', 'FED', 'High', 2, '2023.12', 'Creates AD accounts, assigns group memberships, sends welcome emails', 'Employee data, AD objects, email templates', 'HR_Onboarding_Queue', '\\shared\hr\onboarding', 'hr-automation@company.com', 'In Progress', '2024-02-10', '2024-03-01', '2024-09-01', 'Critical for HR efficiency improvement', 'Comprehensive documentation in Confluence', 2, '\\automation\projects\hr_onboarding'),
    ('AIR-003', 'Monthly Report Generation', 'Reporting', 'Generates monthly financial reports from multiple data sources', 'COE', 'Low', 3, '2023.8', 'Collects data from various systems, compiles reports, and distributes', 'Excel templates, database connections, email distribution', 'Report_Generation_Queue', '\\shared\reports', 'reports@company.com', 'Completed', '2023-11-15', '2023-12-01', '2024-06-01', 'Stable automation with minimal maintenance', 'User guide available', 15, '\\automation\projects\monthly_reports');

-- Insert automation people roles
INSERT INTO automation_people_roles (automation_id, person_id, role) VALUES
    ('AIR-001', 3, 'Project Manager'),
    ('AIR-001', 4, 'Developer'),
    ('AIR-001', 5, 'Tester'),
    ('AIR-001', 6, 'Business SPOC'),
    ('AIR-002', 7, 'Project Manager'),
    ('AIR-002', 8, 'Developer'),
    ('AIR-002', 9, 'Tester'),
    ('AIR-002', 10, 'Business SPOC'),
    ('AIR-003', 11, 'Project Manager'),
    ('AIR-003', 12, 'Developer'),
    ('AIR-003', 13, 'Tester'),
    ('AIR-003', 14, 'Business SPOC');

-- Insert environments
INSERT INTO environments (automation_id, type, vdi, service_account) VALUES
    ('AIR-001', 'Dev', 'DEV-VDI-01', 'sa_dev_invoice'),
    ('AIR-001', 'QA', 'QA-VDI-01', 'sa_qa_invoice'),
    ('AIR-001', 'Prod', 'PROD-VDI-01', 'sa_prod_invoice'),
    ('AIR-002', 'Dev', 'DEV-VDI-02', 'sa_dev_hr'),
    ('AIR-002', 'QA', 'QA-VDI-02', 'sa_qa_hr'),
    ('AIR-002', 'Prod', 'PROD-VDI-02', 'sa_prod_hr'),
    ('AIR-003', 'Dev', 'DEV-VDI-03', 'sa_dev_reports'),
    ('AIR-003', 'QA', 'QA-VDI-03', 'sa_qa_reports'),
    ('AIR-003', 'Prod', 'PROD-VDI-03', 'sa_prod_reports');

-- Insert test data
INSERT INTO test_data (automation_id, spoc_id, data_location, data_description) VALUES
    ('AIR-001', 5, '\\test_data\invoice_samples', 'Sample invoice PDFs and test scenarios'),
    ('AIR-002', 9, '\\test_data\employee_data', 'Mock employee data for testing'),
    ('AIR-003', 13, '\\test_data\financial_data', 'Test financial data extracts');

-- Insert metrics
INSERT INTO metrics (automation_id, post_prod_total_cases, post_prod_sys_ex_count, post_prod_success_rate, measurement_date) VALUES
    ('AIR-001', 1250, 12, 99.04, '2024-01-31'),
    ('AIR-002', 85, 3, 96.47, '2024-02-29'),
    ('AIR-003', 36, 0, 100.00, '2024-01-31');

-- Insert artifacts
INSERT INTO artifacts (automation_id, artifacts_link, code_review, demo, rampup_issue_list) VALUES
    ('AIR-001', 'https://sharepoint.com/automation/AIR-001', 'Completed', 'Completed', 'Minor issues resolved'),
    ('AIR-002', 'https://sharepoint.com/automation/AIR-002', 'In Progress', 'Scheduled', 'Issues being tracked'),
    ('AIR-003', 'https://sharepoint.com/automation/AIR-003', 'Completed', 'Completed', 'No issues');

-- Create a comprehensive view for easy querying
CREATE VIEW automation_full_view AS
SELECT 
    a.air_id,
    a.name,
    a.type,
    a.brief_description,
    a.coe_fed,
    a.complexity,
    t.name as tool_name,
    a.tool_version,
    a.process_details,
    a.object_details,
    a.queue,
    a.shared_folders,
    a.shared_mailboxes,
    a.qa_handshake,
    a.preprod_deploy_date,
    a.prod_deploy_date,
    a.warranty_end_date,
    a.comments,
    a.documentation,
    a.modified,
    p.name as modified_by_name,
    a.path,
    m.post_prod_total_cases,
    m.post_prod_sys_ex_count,
    m.post_prod_success_rate,
    art.artifacts_link,
    art.code_review,
    art.demo,
    art.rampup_issue_list
FROM automations a
LEFT JOIN tools t ON a.tool_id = t.id
LEFT JOIN people p ON a.modified_by_id = p.id
LEFT JOIN metrics m ON a.air_id = m.automation_id
LEFT JOIN artifacts art ON a.air_id = art.automation_id;

-- Create a function for fuzzy search
CREATE OR REPLACE FUNCTION search_automations(search_term TEXT)
RETURNS TABLE (
    air_id VARCHAR(20),
    name VARCHAR(300),
    type VARCHAR(100),
    brief_description TEXT,
    similarity REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.air_id,
        a.name,
        a.type,
        a.brief_description,
        GREATEST(
            similarity(a.name, search_term),
            similarity(a.type, search_term),
            similarity(COALESCE(a.brief_description, ''), search_term)
        ) as similarity
    FROM automations a
    WHERE 
        a.name ILIKE '%' || search_term || '%' OR
        a.type ILIKE '%' || search_term || '%' OR
        a.brief_description ILIKE '%' || search_term || '%' OR
        similarity(a.name, search_term) > 0.3 OR
        similarity(a.type, search_term) > 0.3 OR
        similarity(COALESCE(a.brief_description, ''), search_term) > 0.3
    ORDER BY similarity DESC, a.name;
END;
$$ LANGUAGE plpgsql;

-- Add some useful comments
COMMENT ON TABLE automations IS 'Main table storing automation records with basic information';
COMMENT ON TABLE automation_people_roles IS 'Junction table for many-to-many relationship between automations and people with their roles';
COMMENT ON TABLE environments IS 'Environment-specific configuration for each automation';
COMMENT ON TABLE metrics IS 'Performance metrics for automations post-production';
COMMENT ON TABLE artifacts IS 'Links and status of automation artifacts and deliverables';
COMMENT ON FUNCTION search_automations IS 'Fuzzy search function for automations using pg_trgm';
