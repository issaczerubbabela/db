import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artifact } from './artifact.entity';
import { CreateArtifactDto } from './dto/create-artifact.dto';
import { UpdateArtifactDto } from './dto/update-artifact.dto';

@Injectable()
export class ArtifactsService {
  constructor(
    @InjectRepository(Artifact)
    private artifactsRepository: Repository<Artifact>,
  ) {}

  async create(createArtifactDto: CreateArtifactDto): Promise<Artifact> {
    const artifact = this.artifactsRepository.create(createArtifactDto);
    return await this.artifactsRepository.save(artifact);
  }

  async findAll(): Promise<Artifact[]> {
    return await this.artifactsRepository.find({
      relations: ['automation'],
    });
  }

  async findOne(id: number): Promise<Artifact> {
    const artifact = await this.artifactsRepository.findOne({
      where: { id },
      relations: ['automation'],
    });
    
    if (!artifact) {
      throw new NotFoundException(`Artifact with ID ${id} not found`);
    }
    
    return artifact;
  }

  async update(id: number, updateArtifactDto: UpdateArtifactDto): Promise<Artifact> {
    const artifact = await this.findOne(id);
    Object.assign(artifact, updateArtifactDto);
    return await this.artifactsRepository.save(artifact);
  }

  async remove(id: number): Promise<void> {
    const artifact = await this.findOne(id);
    await this.artifactsRepository.remove(artifact);
  }
}
