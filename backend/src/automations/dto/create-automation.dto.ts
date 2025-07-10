import { IsString, IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAutomationDto {
  @ApiProperty({ description: 'Unique AIR ID for the automation' })
  @IsString()
  air_id: string;

  @ApiProperty({ description: 'Name of the automation' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Type of automation' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Brief description of the automation', required: false })
  @IsOptional()
  @IsString()
  brief_description?: string;

  @ApiProperty({ description: 'COE or FED classification', enum: ['COE', 'FED'], required: false })
  @IsOptional()
  @IsEnum(['COE', 'FED'])
  coe_fed?: 'COE' | 'FED';

  @ApiProperty({ description: 'Complexity level', enum: ['Low', 'Medium', 'High'], required: false })
  @IsOptional()
  @IsEnum(['Low', 'Medium', 'High'])
  complexity?: 'Low' | 'Medium' | 'High';

  @ApiProperty({ description: 'Tool ID reference', required: false })
  @IsOptional()
  @IsNumber()
  tool_id?: number;

  @ApiProperty({ description: 'Version of the tool used', required: false })
  @IsOptional()
  @IsString()
  tool_version?: string;

  @ApiProperty({ description: 'Detailed process description', required: false })
  @IsOptional()
  @IsString()
  process_details?: string;

  @ApiProperty({ description: 'Object details', required: false })
  @IsOptional()
  @IsString()
  object_details?: string;

  @ApiProperty({ description: 'Queue name', required: false })
  @IsOptional()
  @IsString()
  queue?: string;

  @ApiProperty({ description: 'Shared folders path', required: false })
  @IsOptional()
  @IsString()
  shared_folders?: string;

  @ApiProperty({ description: 'Shared mailboxes', required: false })
  @IsOptional()
  @IsString()
  shared_mailboxes?: string;

  @ApiProperty({ description: 'QA handshake status', required: false })
  @IsOptional()
  @IsString()
  qa_handshake?: string;

  @ApiProperty({ description: 'PreProd deployment date', required: false })
  @IsOptional()
  @IsDateString()
  preprod_deploy_date?: string;

  @ApiProperty({ description: 'Production deployment date', required: false })
  @IsOptional()
  @IsDateString()
  prod_deploy_date?: string;

  @ApiProperty({ description: 'Warranty end date', required: false })
  @IsOptional()
  @IsDateString()
  warranty_end_date?: string;

  @ApiProperty({ description: 'Comments', required: false })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiProperty({ description: 'Documentation details', required: false })
  @IsOptional()
  @IsString()
  documentation?: string;

  @ApiProperty({ description: 'Person ID who modified the record', required: false })
  @IsOptional()
  @IsNumber()
  modified_by_id?: number;

  @ApiProperty({ description: 'File path', required: false })
  @IsOptional()
  @IsString()
  path?: string;
}
