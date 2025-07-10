import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AutomationsService } from './automations.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';

@ApiTags('automations')
@Controller('automations')
export class AutomationsController {
  constructor(private readonly automationsService: AutomationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new automation record' })
  @ApiResponse({ status: 201, description: 'The automation has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createAutomationDto: CreateAutomationDto) {
    return this.automationsService.create(createAutomationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all automation records' })
  @ApiResponse({ status: 200, description: 'Return all automations.' })
  findAll() {
    return this.automationsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search automation records' })
  @ApiResponse({ status: 200, description: 'Return matching automations.' })
  search(@Query('q') searchTerm: string) {
    return this.automationsService.search(searchTerm);
  }

  @Get(':air_id')
  @ApiOperation({ summary: 'Get an automation record by AIR ID' })
  @ApiResponse({ status: 200, description: 'Return the automation.' })
  @ApiResponse({ status: 404, description: 'Automation not found.' })
  findOne(@Param('air_id') air_id: string) {
    return this.automationsService.findOne(air_id);
  }

  @Patch(':air_id')
  @ApiOperation({ summary: 'Update an automation record' })
  @ApiResponse({ status: 200, description: 'The automation has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Automation not found.' })
  update(@Param('air_id') air_id: string, @Body() updateAutomationDto: UpdateAutomationDto) {
    return this.automationsService.update(air_id, updateAutomationDto);
  }

  @Delete(':air_id')
  @ApiOperation({ summary: 'Delete an automation record' })
  @ApiResponse({ status: 200, description: 'The automation has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Automation not found.' })
  remove(@Param('air_id') air_id: string) {
    return this.automationsService.remove(air_id);
  }
}
