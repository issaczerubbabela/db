import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtifactDto {
  @ApiProperty({ description: 'Automation ID', maxLength: 20 })
  @IsString()
  @MaxLength(20)
  automation_id: string;

  @ApiProperty({ description: 'Link to artifacts', required: false })
  @IsOptional()
  @IsString()
  artifacts_link?: string;

  @ApiProperty({ description: 'Code review information', maxLength: 50, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  code_review?: string;

  @ApiProperty({ description: 'Demo information', maxLength: 50, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  demo?: string;

  @ApiProperty({ description: 'Ramp-up issue list', required: false })
  @IsOptional()
  @IsString()
  rampup_issue_list?: string;
}
