import { getAllAutomations, createAutomation } from '../../../../lib/database';

export async function GET() {
  try {
    const automations = getAllAutomations();
    return Response.json(automations);
  } catch (error) {
    console.error('Error fetching automations:', error);
    return Response.json({ error: 'Failed to fetch automations' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const automationData = await request.json();
    const newAutomation = createAutomation(automationData);
    return Response.json(newAutomation, { status: 201 });
  } catch (error) {
    console.error('Error creating automation:', error);
    return Response.json({ error: 'Failed to create automation' }, { status: 500 });
  }
}
