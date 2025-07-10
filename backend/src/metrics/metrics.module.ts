import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Metric } from './metric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Metric])],
  exports: [TypeOrmModule],
})
export class MetricsModule {}
