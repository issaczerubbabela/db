'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, PlusIcon, ViewColumnsIcon, RectangleStackIcon, DocumentArrowUpIcon, TrashIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
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
  const [isImporting, setIsImporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    complexity: '',
    coe_fed: '',
    hasDescription: '',
    dateRange: ''
  });
  const fileInputRef = useRef(null);
  const filterDropdownRef = useRef(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleDeleteAutomation = async (airId) => {
    if (!confirm(`Are you sure you want to delete automation ${airId}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/automations/${airId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from local state
        setAutomations(prev => prev.filter(automation => automation.air_id !== airId));
        
        // Close sidebar if the deleted automation was selected
        if (selectedAutomation?.air_id === airId) {
          setIsSidebarOpen(false);
          setSelectedAutomation(null);
        }
        
        console.log(`Automation ${airId} deleted successfully`);
      } else {
        const error = await response.text();
        console.error('Failed to delete automation:', error);
        alert(`Failed to delete automation: ${error}`);
      }
    } catch (error) {
      console.error('Error deleting automation:', error);
      alert('Error deleting automation');
    }
  };

  const parseCsvData = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    // Parse CSV with proper handling of quoted fields containing commas
    const parseCSVLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseCSVLine(lines[0]);
    console.log('CSV Headers:', headers);
    const automations = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      console.log(`Line ${i} values count: ${values.length}, headers count: ${headers.length}`);
      
      if (values.length === headers.length) {
        const automation = {};
        headers.forEach((header, index) => {
          // Direct field mapping - headers should match database fields exactly
          automation[header] = values[index] || '';
        });
        
        // Validate and clean the automation data
        const cleanedAutomation = {
          air_id: automation.air_id?.trim() || '',
          name: automation.name?.trim() || '',
          type: automation.type?.trim() || '',
          brief_description: automation.brief_description?.trim() || null,
          coe_fed: automation.coe_fed?.trim() || null,
          complexity: automation.complexity?.trim() || null,
          // Combine tool and tool_version into tool_version field since DB doesn't have separate tool field
          tool_version: automation.tool_version?.trim() || automation.tool?.trim() || null,
          process_details: automation.process_details?.trim() || null,
          object_details: automation.object_details?.trim() || null,
          queue: automation.queue?.trim() || null,
          shared_folders: automation.shared_folders?.trim() || null,
          shared_mailboxes: automation.shared_mailboxes?.trim() || null,
          qa_handshake: automation.qa_handshake?.trim() || null,
          preprod_deploy_date: automation.preprod_deploy_date?.trim() || null,
          prod_deploy_date: automation.prod_deploy_date?.trim() || null,
          warranty_end_date: automation.warranty_end_date?.trim() || null,
          comments: automation.comments?.trim() || null,
          documentation: automation.documentation?.trim() || null,
          modified: automation.modified?.trim() || null,
          // Skip modified_by since DB expects modified_by_id (foreign key)
          path: automation.path?.trim() || null,
          // Initialize empty arrays/objects for related data
          people: [],
          environments: [],
          test_data: {},
          metrics: {},
          artifacts: {}
        };
        
        console.log('Cleaned automation:', cleanedAutomation);
        
        // Ensure required fields exist and are not empty
        if (cleanedAutomation.air_id && cleanedAutomation.name && cleanedAutomation.type) {
          automations.push(cleanedAutomation);
        } else {
          console.warn(`Skipping automation on line ${i}: missing required fields`, {
            air_id: cleanedAutomation.air_id,
            name: cleanedAutomation.name,
            type: cleanedAutomation.type
          });
        }
      } else {
        console.warn(`Line ${i} has ${values.length} values but expected ${headers.length}`);
      }
    }
    return automations;
  };

  const handleCsvImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setIsImporting(true);
    try {
      const text = await file.text();
      console.log('CSV text length:', text.length);
      console.log('First 200 characters:', text.substring(0, 200));
      
      const csvAutomations = parseCsvData(text);
      console.log('Parsed automations:', csvAutomations.length);
      console.log('First automation:', csvAutomations[0]);
      
      if (csvAutomations.length === 0) {
        alert('No valid automation data found in CSV. Please check that the CSV has the correct headers and data format.');
        return;
      }

      // Import automations one by one
      let successCount = 0;
      let errorCount = 0;
      const errors = [];
      
      for (const automation of csvAutomations) {
        try {
          console.log('Importing automation:', automation.air_id);
          const response = await fetch('/api/automations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(automation),
          });

          if (response.ok) {
            successCount++;
            console.log('Successfully imported:', automation.air_id);
          } else {
            errorCount++;
            const errorText = await response.text();
            console.error('Failed to import:', automation.air_id, 'Error:', errorText);
            errors.push(`${automation.air_id}: ${errorText}`);
          }
        } catch (error) {
          errorCount++;
          console.error('Error importing automation:', automation.air_id, error);
          errors.push(`${automation.air_id}: ${error.message}`);
        }
      }

      // Refresh the automations list
      await fetchAutomations();
      
      let message = `Successfully imported ${successCount} out of ${csvAutomations.length} automations`;
      if (errorCount > 0) {
        message += `\n\nErrors encountered:\n${errors.slice(0, 3).join('\n')}`;
        if (errors.length > 3) {
          message += `\n... and ${errors.length - 3} more errors`;
        }
      }
      alert(message);
      
    } catch (error) {
      console.error('Error reading CSV file:', error);
      alert('Error reading CSV file');
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (field) => {
    const values = automations
      .map(automation => automation[field])
      .filter(value => value && value.trim())
      .map(value => value.trim());
    return [...new Set(values)].sort();
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      complexity: '',
      coe_fed: '',
      hasDescription: '',
      dateRange: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

  const filteredAutomations = automations.filter(automation => {
    // Search term filter
    const matchesSearch = !searchTerm || (
      automation.air_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      automation.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      automation.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      automation.brief_description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Type filter
    const matchesType = !filters.type || automation.type?.toLowerCase() === filters.type.toLowerCase();

    // Complexity filter
    const matchesComplexity = !filters.complexity || automation.complexity?.toLowerCase() === filters.complexity.toLowerCase();

    // COE/FED filter
    const matchesCoeFed = !filters.coe_fed || automation.coe_fed?.toLowerCase() === filters.coe_fed.toLowerCase();

    // Has description filter
    const matchesDescription = !filters.hasDescription || 
      (filters.hasDescription === 'with' && automation.brief_description) ||
      (filters.hasDescription === 'without' && !automation.brief_description);

    // Date range filter (basic implementation)
    const matchesDateRange = !filters.dateRange || (() => {
      const now = new Date();
      const createdAt = automation.created_at ? new Date(automation.created_at) : null;
      if (!createdAt) return filters.dateRange === 'unknown';

      switch (filters.dateRange) {
        case 'today':
          return createdAt.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return createdAt >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return createdAt >= monthAgo;
        case 'unknown':
          return !automation.created_at;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesType && matchesComplexity && matchesCoeFed && matchesDescription && matchesDateRange;
  });

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
            automations={filteredAutomations} 
            loading={loading} 
            onViewTypeChange={setViewType}
            onAddAutomation={() => setIsFormOpen(true)}
            onDeleteAutomation={handleDeleteAutomation}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFiltersChange={setFilters}
            showFilters={showFilters}
            onToggleFilters={setShowFilters}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            getUniqueValues={getUniqueValues}
            allAutomations={automations}
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
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
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
                  
                  {/* Filter Button */}
                  <div className="relative" ref={filterDropdownRef}>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                        hasActiveFilters 
                          ? 'border-blue-500 text-blue-600 bg-blue-50' 
                          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <FunnelIcon className="h-4 w-4 mr-2" />
                      Filters
                      {hasActiveFilters && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {Object.values(filters).filter(f => f !== '').length}
                        </span>
                      )}
                      <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Filter Dropdown */}
                    {showFilters && (
                      <div ref={filterDropdownRef} className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                            {hasActiveFilters && (
                              <button
                                onClick={clearFilters}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                Clear all
                              </button>
                            )}
                          </div>
                          
                          <div className="space-y-4">
                            {/* Type Filter */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                              <select
                                value={filters.type}
                                onChange={(e) => setFilters({...filters, type: e.target.value})}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">All types</option>
                                {getUniqueValues('type').map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </div>
                            
                            {/* Complexity Filter */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Complexity</label>
                              <select
                                value={filters.complexity}
                                onChange={(e) => setFilters({...filters, complexity: e.target.value})}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">All complexities</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            </div>
                            
                            {/* COE/FED Filter */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">COE/FED</label>
                              <select
                                value={filters.coe_fed}
                                onChange={(e) => setFilters({...filters, coe_fed: e.target.value})}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">All COE/FED</option>
                                {getUniqueValues('coe_fed').map(coe => (
                                  <option key={coe} value={coe}>{coe}</option>
                                ))}
                              </select>
                            </div>
                            
                            {/* Description Filter */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                              <select
                                value={filters.hasDescription}
                                onChange={(e) => setFilters({...filters, hasDescription: e.target.value})}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">All</option>
                                <option value="with">With description</option>
                                <option value="without">Without description</option>
                              </select>
                            </div>
                            
                            {/* Date Range Filter */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                              <select
                                value={filters.dateRange}
                                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">All time</option>
                                <option value="today">Today</option>
                                <option value="week">Past week</option>
                                <option value="month">Past month</option>
                                <option value="unknown">Unknown date</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
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
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteAutomation(automation.air_id);
                                  }}
                                  className="text-red-400 hover:text-red-600 transition-colors p-1"
                                  title="Delete automation"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                              </div>
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
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-gray-500">
                    Showing {filteredAutomations.length} of {automations.length} automations
                    {hasActiveFilters && (
                      <span className="text-blue-600 ml-1">(filtered)</span>
                    )}
                  </p>
                  {/* Small CSV Import Button */}
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleCsvImport}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isImporting}
                      className="flex items-center px-2 py-1 text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                      title="Import CSV (for testing)"
                    >
                      <DocumentArrowUpIcon className="h-3 w-3 mr-1" />
                      {isImporting ? 'Importing...' : 'CSV'}
                    </button>
                  </div>
                </div>
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
              onDeleteAutomation={handleDeleteAutomation}
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
