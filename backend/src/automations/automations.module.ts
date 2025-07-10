import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationsService } from './automations.service';
import { AutomationsController } from './automations.controller';
import { Automation } from './automation.entity';
import { AutomationPersonRole } from './automation-person-role.entity';
import { TestData } from './test-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Automation, AutomationPersonRole, TestData])],
  controllers: [AutomationsController],
  providers: [AutomationsService],
  exports: [AutomationsService],
})
export class AutomationsModule {}
