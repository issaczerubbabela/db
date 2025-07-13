import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationsModule } from './automations/automations.module';
import { PeopleModule } from './people/people.module';
import { ToolsModule } from './tools/tools.module';
import { EnvironmentsModule } from './environments/environments.module';
import { MetricsModule } from './metrics/metrics.module';
import { ArtifactsModule } from './artifacts/artifacts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: '../automation_database.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    AutomationsModule,
    PeopleModule,
    ToolsModule,
    EnvironmentsModule,
    MetricsModule,
    ArtifactsModule,
  ],
})
export class AppModule {}
