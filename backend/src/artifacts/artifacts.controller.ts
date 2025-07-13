import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ArtifactsService } from './artifacts.service';
import { CreateArtifactDto } from './dto/create-artifact.dto';
import { UpdateArtifactDto } from './dto/update-artifact.dto';

@ApiTags('artifacts')
@Controller('artifacts')
export class ArtifactsController {
  constructor(private readonly artifactsService: ArtifactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new artifact record' })
  @ApiResponse({ status: 201, description: 'The artifact has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createArtifactDto: CreateArtifactDto) {
    return this.artifactsService.create(createArtifactDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all artifact records' })
  @ApiResponse({ status: 200, description: 'Return all artifacts.' })
  findAll() {
    return this.artifactsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an artifact record by ID' })
  @ApiResponse({ status: 200, description: 'Return the artifact.' })
  @ApiResponse({ status: 404, description: 'Artifact not found.' })
  findOne(@Param('id') id: string) {
    return this.artifactsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an artifact record' })
  @ApiResponse({ status: 200, description: 'The artifact has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Artifact not found.' })
  update(@Param('id') id: string, @Body() updateArtifactDto: UpdateArtifactDto) {
    return this.artifactsService.update(+id, updateArtifactDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an artifact record' })
  @ApiResponse({ status: 200, description: 'The artifact has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Artifact not found.' })
  remove(@Param('id') id: string) {
    return this.artifactsService.remove(+id);
  }
}
