import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artifact } from './artifact.entity';
import { ArtifactsController } from './artifacts.controller';
import { ArtifactsService } from './artifacts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Artifact])],
  controllers: [ArtifactsController],
  providers: [ArtifactsService],
  exports: [TypeOrmModule, ArtifactsService],
})
export class ArtifactsModule {}
