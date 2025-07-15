// Legacy database file - now delegates to the appropriate adapter
import { createDatabaseAdapter } from './db-config.js';

const dbAdapter = createDatabaseAdapter();

// Export functions that delegate to the appropriate adapter
export const getAllAutomations = dbAdapter.getAllAutomations.bind(dbAdapter);
export const getAutomationById = dbAdapter.getAutomationById.bind(dbAdapter);
export const createAutomation = dbAdapter.createAutomation.bind(dbAdapter);
export const updateAutomation = dbAdapter.updateAutomation?.bind(dbAdapter);
export const deleteAutomation = dbAdapter.deleteAutomation?.bind(dbAdapter);
