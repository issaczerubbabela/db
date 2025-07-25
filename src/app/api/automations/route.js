import { createDatabaseAdapter } from '../../../../lib/db-config';

// Get database adapter based on configuration
const dbAdapter = createDatabaseAdapter();

export async function GET() {
  try {
    const automations = await dbAdapter.getAllAutomations();
    return Response.json(automations);
  } catch (error) {
    console.error('Error fetching automations:', error);
    return Response.json({ error: 'Failed to fetch automations' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const automationData = await request.json();
    console.log('Received automation data:', automationData);
    
    // Validate required fields
    if (!automationData.air_id || !automationData.name || !automationData.type) {
      return Response.json({ 
        error: 'Missing required fields: air_id, name, and type are required' 
      }, { status: 400 });
    }
    
    const newAutomation = await dbAdapter.createAutomation(automationData);
    return Response.json(newAutomation, { status: 201 });
  } catch (error) {
    console.error('Error creating automation:', error);
    
    // Check for specific database errors
    if (error.message.includes('duplicate key') || error.message.includes('E11000')) {
      return Response.json({ 
        error: `Automation with AIR ID already exists: ${error.message}` 
      }, { status: 409 });
    }
    
    return Response.json({ 
      error: `Failed to create automation: ${error.message}` 
    }, { status: 500 });
  }
}
