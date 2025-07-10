'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import AutomationDetailsSidebar from './AutomationDetailsSidebar';

// Mock data for demonstration
const mockAutomations = [
  {
    air_id: 'AIR-001',
    name: 'Invoice Processing Automation',
    type: 'Document Processing',
    brief_description: 'Automates the processing of vendor invoices from receipt to approval',
    coe_fed: 'COE',
    complexity: 'Medium',
    tool: 'UiPath',
    tool_version: '2023.10',
    process_details: 'Extracts data from PDF invoices, validates against purchase orders, and routes for approval',
    object_details: 'Invoice objects, PO validation, approval workflow',
    queue: 'Invoice_Processing_Queue',
    shared_folders: '\\\\shared\\invoices',
    shared_mailboxes: 'invoices@company.com',
    qa_handshake: 'Completed',
    preprod_deploy_date: '2024-01-15',
    prod_deploy_date: '2024-02-01',
    warranty_end_date: '2024-08-01',
    comments: 'High priority automation for finance team',
    documentation: 'Process documentation available in SharePoint',
    modified: '2024-01-20',
    modified_by: 'John Doe',
    path: '\\\\automation\\projects\\invoice_processing',
    people: [
      { name: 'Alice Johnson', role: 'Project Manager' },
      { name: 'Bob Smith', role: 'Developer' },
      { name: 'Carol Davis', role: 'Tester' },
      { name: 'Diana Wilson', role: 'Business SPOC' }
    ],
    environments: [
      { type: 'Dev', vdi: 'DEV-VDI-01', service_account: 'sa_dev_invoice' },
      { type: 'QA', vdi: 'QA-VDI-01', service_account: 'sa_qa_invoice' },
      { type: 'Prod', vdi: 'PROD-VDI-01', service_account: 'sa_prod_invoice' }
    ],
    test_data: {
      spoc: 'Test Data Team'
    },
    metrics: {
      post_prod_total_cases: 1250,
      post_prod_sys_ex_count: 12,
      post_prod_success_rate: 99.04
    },
    artifacts: {
      artifacts_link: 'https://sharepoint.com/automation/AIR-001',
      code_review: 'Completed',
      demo: 'Completed',
      rampup_issue_list: 'Minor issues resolved'
    }
  },
  {
    air_id: 'AIR-002',
    name: 'Employee Onboarding Automation',
    type: 'HR Process',
    brief_description: 'Automates new employee setup including account creation and system access',
    coe_fed: 'FED',
    complexity: 'High',
    tool: 'Power Automate',
    tool_version: '2023.12',
    process_details: 'Creates AD accounts, assigns group memberships, sends welcome emails',
    object_details: 'Employee data, AD objects, email templates',
    queue: 'HR_Onboarding_Queue',
    shared_folders: '\\\\shared\\hr\\onboarding',
    shared_mailboxes: 'hr-automation@company.com',
    qa_handshake: 'In Progress',
    preprod_deploy_date: '2024-02-10',
    prod_deploy_date: '2024-03-01',
    warranty_end_date: '2024-09-01',
    comments: 'Critical for HR efficiency improvement',
    documentation: 'Comprehensive documentation in Confluence',
    modified: '2024-02-05',
    modified_by: 'Jane Smith',
    path: '\\\\automation\\projects\\hr_onboarding',
    people: [
      { name: 'Michael Brown', role: 'Project Manager' },
      { name: 'Sarah Johnson', role: 'Developer' },
      { name: 'Tom Wilson', role: 'Tester' },
      { name: 'Lisa Anderson', role: 'Business SPOC' }
    ],
    environments: [
      { type: 'Dev', vdi: 'DEV-VDI-02', service_account: 'sa_dev_hr' },
      { type: 'QA', vdi: 'QA-VDI-02', service_account: 'sa_qa_hr' },
      { type: 'Prod', vdi: 'PROD-VDI-02', service_account: 'sa_prod_hr' }
    ],
    test_data: {
      spoc: 'HR Test Team'
    },
    metrics: {
      post_prod_total_cases: 85,
      post_prod_sys_ex_count: 3,
      post_prod_success_rate: 96.47
    },
    artifacts: {
      artifacts_link: 'https://sharepoint.com/automation/AIR-002',
      code_review: 'In Progress',
      demo: 'Scheduled',
      rampup_issue_list: 'Issues being tracked'
    }
  },
  {
    air_id: 'AIR-003',
    name: 'Monthly Report Generation',
    type: 'Reporting',
    brief_description: 'Generates monthly financial reports from multiple data sources',
    coe_fed: 'COE',
    complexity: 'Low',
    tool: 'Automation Anywhere',
    tool_version: '2023.8',
    process_details: 'Collects data from various systems, compiles reports, and distributes',
    object_details: 'Excel templates, database connections, email distribution',
    queue: 'Report_Generation_Queue',
    shared_folders: '\\\\shared\\reports',
    shared_mailboxes: 'reports@company.com',
    qa_handshake: 'Completed',
    preprod_deploy_date: '2023-11-15',
    prod_deploy_date: '2023-12-01',
    warranty_end_date: '2024-06-01',
    comments: 'Stable automation with minimal maintenance',
    documentation: 'User guide available',
    modified: '2023-12-10',
    modified_by: 'Robert Johnson',
    path: '\\\\automation\\projects\\monthly_reports',
    people: [
      { name: 'Emily Davis', role: 'Project Manager' },
      { name: 'Chris Miller', role: 'Developer' },
      { name: 'Ashley Taylor', role: 'Tester' },
      { name: 'Mark Thompson', role: 'Business SPOC' }
    ],
    environments: [
      { type: 'Dev', vdi: 'DEV-VDI-03', service_account: 'sa_dev_reports' },
      { type: 'QA', vdi: 'QA-VDI-03', service_account: 'sa_qa_reports' },
      { type: 'Prod', vdi: 'PROD-VDI-03', service_account: 'sa_prod_reports' }
    ],
    test_data: {
      spoc: 'Finance Test Team'
    },
    metrics: {
      post_prod_total_cases: 36,
      post_prod_sys_ex_count: 0,
      post_prod_success_rate: 100.00
    },
    artifacts: {
      artifacts_link: 'https://sharepoint.com/automation/AIR-003',
      code_review: 'Completed',
      demo: 'Completed',
      rampup_issue_list: 'No issues'
    }
  }
];

export default function AutomationDatabase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredAutomations = mockAutomations.filter(automation =>
    automation.air_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    automation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    automation.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    automation.brief_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (automation) => {
    setSelectedAutomation(automation);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedAutomation(null);
  };

  const getComplexityColor = (complexity) => {
    switch (complexity.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Automation Database
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and track automation records
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="px-6 pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search automations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-4">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AIR ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Automation Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Complexity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAutomations.map((automation) => (
                    <tr 
                      key={automation.air_id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(automation)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {automation.air_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {automation.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {automation.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getComplexityColor(automation.complexity)}`}>
                          {automation.complexity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                        {automation.brief_description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredAutomations.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No automations found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Showing {filteredAutomations.length} of {mockAutomations.length} automations
            </p>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <AutomationDetailsSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        automation={selectedAutomation}
      />
    </div>
  );
}
