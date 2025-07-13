import { deleteAutomation } from '../../../../../lib/database';

export async function DELETE(request, { params }) {
  try {
    const { air_id } = await params;
    
    if (!air_id) {
      return Response.json({ error: 'AIR ID is required' }, { status: 400 });
    }
    
    const deletedCount = deleteAutomation(air_id);
    
    if (deletedCount > 0) {
      return Response.json({ 
        message: `Automation with AIR ID ${air_id} deleted successfully` 
      }, { status: 200 });
    } else {
      return Response.json({ 
        error: `Automation with AIR ID ${air_id} not found` 
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting automation:', error);
    return Response.json({ 
      error: `Failed to delete automation: ${error.message}` 
    }, { status: 500 });
  }
}
