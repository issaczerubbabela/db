'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { 
  UserIcon, 
  ComputerDesktopIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  LinkIcon,
  ClockIcon,
  CogIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function AutomationDetailsSidebar({ isOpen, onClose, automation }) {
  if (!automation) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in progress':
        return 'text-yellow-600 bg-yellow-50';
      case 'pending':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  return (
    <div className={`h-full bg-white shadow-xl border-l border-gray-200 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex h-full flex-col overflow-y-scroll">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CogIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-medium text-white">
                  {automation.name}
                </h2>
                <p className="text-sm text-blue-100">
                  {automation.air_id}
                </p>
              </div>
            </div>
            <div className="ml-3 flex h-7 items-center">
              <button
                type="button"
                className="rounded-md bg-blue-600 text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                onClick={onClose}
              >
                <span className="sr-only">Close panel</span>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-6">
          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-500" />
                Basic Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <p className="text-sm text-gray-900">{automation.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">COE/FED</label>
                    <p className="text-sm text-gray-900">{automation.coe_fed}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Complexity</label>
                    <p className="text-sm text-gray-900">{automation.complexity}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-sm text-gray-900">{automation.brief_description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tool Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CogIcon className="h-5 w-5 mr-2 text-gray-500" />
                Tool Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tool</label>
                    <p className="text-sm text-gray-900">{automation.tool}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Version</label>
                    <p className="text-sm text-gray-900">{automation.tool_version}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Process Details</label>
                  <p className="text-sm text-gray-900">{automation.process_details}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Object Details</label>
                  <p className="text-sm text-gray-900">{automation.object_details}</p>
                </div>
              </div>
            </div>

            {/* People & Roles */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                People & Roles
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  {automation.people.map((person, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-sm text-gray-900">{person.name}</span>
                      <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded text-xs">{person.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Environment Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ComputerDesktopIcon className="h-5 w-5 mr-2 text-gray-500" />
                Environment Details
              </h3>
              <div className="space-y-3">
                {automation.environments.map((env, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{env.type} Environment</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="text-sm font-medium text-gray-500">VDI</label>
                        <p className="text-sm text-gray-900">{env.vdi}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Service Account</label>
                        <p className="text-sm text-gray-900">{env.service_account}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Infrastructure */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ComputerDesktopIcon className="h-5 w-5 mr-2 text-gray-500" />
                Infrastructure
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Queue</label>
                  <p className="text-sm text-gray-900">{automation.queue}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Shared Folders</label>
                  <p className="text-sm text-gray-900">{automation.shared_folders}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Shared Mailboxes</label>
                  <p className="text-sm text-gray-900">{automation.shared_mailboxes}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Path</label>
                  <p className="text-sm text-gray-900 break-all">{automation.path}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
                Timeline
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">PreProd Deployment</label>
                    <p className="text-sm text-gray-900">{formatDate(automation.preprod_deploy_date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Prod Deployment</label>
                    <p className="text-sm text-gray-900">{formatDate(automation.prod_deploy_date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Warranty End</label>
                    <p className="text-sm text-gray-900">{formatDate(automation.warranty_end_date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Modified</label>
                    <p className="text-sm text-gray-900">{formatDate(automation.modified)} by {automation.modified_by}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-gray-500" />
                Performance Metrics
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatPercentage(automation.metrics.post_prod_success_rate)}
                    </div>
                    <div className="text-sm text-gray-500">Success Rate</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-semibold text-blue-600">
                        {automation.metrics.post_prod_total_cases.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Total Cases</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold text-red-600">
                        {automation.metrics.post_prod_sys_ex_count}
                      </div>
                      <div className="text-sm text-gray-500">System Exceptions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Assurance */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2 text-gray-500" />
                Quality Assurance
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">QA Handshake</label>
                  <p className={`text-sm px-2 py-1 rounded text-xs inline-block ${getStatusColor(automation.qa_handshake)}`}>
                    {automation.qa_handshake}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Test Data SPOC</label>
                  <p className="text-sm text-gray-900">{automation.test_data.spoc}</p>
                </div>
              </div>
            </div>

            {/* Artifacts & Links */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <LinkIcon className="h-5 w-5 mr-2 text-gray-500" />
                Artifacts & Links
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Artifacts Link</label>
                  <a href={automation.artifacts.artifacts_link} className="text-sm text-blue-600 hover:text-blue-800 underline block">
                    {automation.artifacts.artifacts_link}
                  </a>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Code Review</label>
                    <p className={`text-sm px-2 py-1 rounded text-xs inline-block ${getStatusColor(automation.artifacts.code_review)}`}>
                      {automation.artifacts.code_review}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Demo</label>
                    <p className={`text-sm px-2 py-1 rounded text-xs inline-block ${getStatusColor(automation.artifacts.demo)}`}>
                      {automation.artifacts.demo}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Rampup Issues</label>
                    <p className="text-sm text-gray-900">{automation.artifacts.rampup_issue_list}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments & Documentation */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-500" />
                Comments & Documentation
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Comments</label>
                  <p className="text-sm text-gray-900">{automation.comments}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Documentation</label>
                  <p className="text-sm text-gray-900">{automation.documentation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
