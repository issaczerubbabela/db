import { MongoClient, ObjectId } from 'mongodb';
import { DATABASE_CONFIG } from './db-config.js';

let client;
let db;

export async function getDatabase() {
  if (!client) {
    client = new MongoClient(DATABASE_CONFIG.mongodb.uri);
    await client.connect();
    db = client.db(DATABASE_CONFIG.mongodb.dbName);
    console.log('Connected to MongoDB');
  }
  return db;
}

export async function getAllAutomations() {
  const database = await getDatabase();
  const automations = await database.collection('automations')
    .find({})
    .sort({ created_at: -1 })
    .toArray();

  // Transform MongoDB documents to match expected format
  return automations.map(automation => ({
    ...automation,
    id: automation._id.toString(),
    people: automation.people || [],
    environments: automation.environments || [],
    test_data: automation.test_data || {},
    metrics: automation.metrics || {},
    artifacts: automation.artifacts || {}
  }));
}

export async function getAutomationById(id) {
  const database = await getDatabase();
  let automation;
  
  try {
    // Try to find by ObjectId first
    automation = await database.collection('automations').findOne({ _id: new ObjectId(id) });
  } catch (error) {
    // If ObjectId fails, try to find by air_id
    automation = await database.collection('automations').findOne({ air_id: id });
  }
  
  if (!automation) return null;

  return {
    ...automation,
    id: automation._id.toString(),
    people: automation.people || [],
    environments: automation.environments || [],
    test_data: automation.test_data || {},
    metrics: automation.metrics || {},
    artifacts: automation.artifacts || {}
  };
}

export async function createAutomation(automationData) {
  const database = await getDatabase();
  
  const automationDoc = {
    ...automationData,
    created_at: new Date(),
    updated_at: new Date()
  };

  const result = await database.collection('automations').insertOne(automationDoc);
  
  // Return the created automation
  const createdAutomation = await database.collection('automations').findOne({ _id: result.insertedId });
  
  return {
    ...createdAutomation,
    id: createdAutomation._id.toString(),
    people: createdAutomation.people || [],
    environments: createdAutomation.environments || [],
    test_data: createdAutomation.test_data || {},
    metrics: createdAutomation.metrics || {},
    artifacts: createdAutomation.artifacts || {}
  };
}

export async function updateAutomation(id, updateData) {
  const database = await getDatabase();
  
  const updateDoc = {
    ...updateData,
    updated_at: new Date()
  };

  let result;
  try {
    // Try to update by ObjectId first
    result = await database.collection('automations').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );
  } catch (error) {
    // If ObjectId fails, try to update by air_id
    result = await database.collection('automations').updateOne(
      { air_id: id },
      { $set: updateDoc }
    );
  }

  if (result.matchedCount === 0) {
    throw new Error(`Automation with ID ${id} not found`);
  }

  return await getAutomationById(id);
}

export async function deleteAutomation(airId) {
  const database = await getDatabase();
  
  const result = await database.collection('automations').deleteOne({ air_id: airId });
  
  if (result.deletedCount === 0) {
    throw new Error(`Automation with AIR ID ${airId} not found`);
  }
  
  return result.deletedCount;
}

export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('Disconnected from MongoDB');
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeConnection();
  process.exit(0);
});
