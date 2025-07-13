'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon, ViewColumnsIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import AutomationDetailsSidebar from './AutomationDetailsSidebar';
import AutomationForm from './AutomationForm';
import AutomationTabView from './AutomationTabView';

export default function AutomationDatabase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('slide'); // 'slide' or 'tab'

  // Fetch automations from API
  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/automations');
      if (response.ok) {
        const data = await response.json();
        setAutomations(data);
      } else {
        console.error('Failed to fetch automations');
      }
    } catch (error) {
      console.error('Error fetching automations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAutomation = async (automationData) => {
    try {
      const response = await fetch('/api/automations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(automationData),
      });

      if (response.ok) {
        const newAutomation = await response.json();
        setAutomations(prev => [newAutomation, ...prev]);
        setIsFormOpen(false);
      } else {
        console.error('Failed to create automation');
      }
    } catch (error) {
      console.error('Error creating automation:', error);
    }
  };

  const filteredAutomations = automations.filter(automation =>
    automation.air_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    automation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    automation.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    automation.brief_description?.toLowerCase().includes(searchTerm.toLowerCase())
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
      {viewType === 'tab' ? (
        // Tab View
        <div className="w-full">
          <AutomationTabView 
            automations={automations} 
            loading={loading} 
            onViewTypeChange={setViewType}
            onAddAutomation={() => setIsFormOpen(true)}
          />
        </div>
      ) : (
        // Slide View (Original)
        <>
          {/* Main Content Area */}
          <div className={`flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-2/3' : 'w-full'}`}>
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
              <div className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                      Automation Database
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                      Manage and track automation records
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* View Toggle */}
                    <div className="flex bg-gray-100 rounded-md p-1">
                      <button
                        onClick={() => setViewType('slide')}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          viewType === 'slide'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <ViewColumnsIcon className="h-4 w-4 mr-2" />
                        Slide View
                      </button>
                      <button
                        onClick={() => setViewType('tab')}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          viewType === 'tab'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <RectangleStackIcon className="h-4 w-4 mr-2" />
                        Tab View
                      </button>
                    </div>
                    
                    <button
                      onClick={() => setIsFormOpen(true)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add Automation
                    </button>
                  </div>
                </div>
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
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 text-black rounded-md leading-5 bg-white placeholder-black-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <div className="px-6 py-4">
                {loading ? (
                  <div className="bg-white shadow rounded-lg p-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-500 mt-4">Loading automations...</p>
                    </div>
                  </div>
                ) : (
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
                            className={`hover:bg-gray-50 cursor-pointer transition-colors ${selectedAutomation?.air_id === automation.air_id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
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
                              {automation.complexity && (
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getComplexityColor(automation.complexity)}`}>
                                  {automation.complexity}
                                </span>
                              )}
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
                    
                    {filteredAutomations.length === 0 && !loading && (
                      <div className="text-center py-12">
                        <p className="text-gray-500">
                          {automations.length === 0 
                            ? 'No automations found. Click "Add Automation" to create your first one.'
                            : 'No automations found matching your search.'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-200 px-6 py-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Showing {filteredAutomations.length} of {automations.length} automations
                </p>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-1/3' : 'w-0'} overflow-hidden`}>
            <AutomationDetailsSidebar
              isOpen={isSidebarOpen}
              onClose={closeSidebar}
              automation={selectedAutomation}
            />
          </div>
        </>
      )}

      {/* Form Modal */}
      <AutomationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateAutomation}
      />
    </div>
  );
}
