import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artifact } from './artifact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artifact])],
  exports: [TypeOrmModule],
})
export class ArtifactsModule {}
