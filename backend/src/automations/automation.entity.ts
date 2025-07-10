import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tool } from '../tools/tool.entity';
import { Person } from '../people/person.entity';
import { AutomationPersonRole } from './automation-person-role.entity';
import { Environment } from '../environments/environment.entity';
import { Metric } from '../metrics/metric.entity';
import { Artifact } from '../artifacts/artifact.entity';
import { TestData } from './test-data.entity';

@Entity('automations')
export class Automation {
  @PrimaryColumn({ length: 20 })
  air_id: string;

  @Column({ length: 300 })
  name: string;

  @Column({ length: 100 })
  type: string;

  @Column({ type: 'text', nullable: true })
  brief_description: string;

  @Column({ length: 10, nullable: true })
  coe_fed: 'COE' | 'FED';

  @Column({ length: 20, nullable: true })
  complexity: 'Low' | 'Medium' | 'High';

  @Column({ nullable: true })
  tool_id: number;

  @Column({ length: 50, nullable: true })
  tool_version: string;

  @Column({ type: 'text', nullable: true })
  process_details: string;

  @Column({ type: 'text', nullable: true })
  object_details: string;

  @Column({ length: 200, nullable: true })
  queue: string;

  @Column({ type: 'text', nullable: true })
  shared_folders: string;

  @Column({ length: 500, nullable: true })
  shared_mailboxes: string;

  @Column({ length: 50, nullable: true })
  qa_handshake: string;

  @Column({ type: 'date', nullable: true })
  preprod_deploy_date: Date;

  @Column({ type: 'date', nullable: true })
  prod_deploy_date: Date;

  @Column({ type: 'date', nullable: true })
  warranty_end_date: Date;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'text', nullable: true })
  documentation: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modified: Date;

  @Column({ nullable: true })
  modified_by_id: number;

  @Column({ type: 'text', nullable: true })
  path: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Tool, { nullable: true })
  @JoinColumn({ name: 'tool_id' })
  tool: Tool;

  @ManyToOne(() => Person, { nullable: true })
  @JoinColumn({ name: 'modified_by_id' })
  modified_by: Person;

  @OneToMany(() => AutomationPersonRole, role => role.automation)
  people_roles: AutomationPersonRole[];

  @OneToMany(() => Environment, env => env.automation)
  environments: Environment[];

  @OneToMany(() => Metric, metric => metric.automation)
  metrics: Metric[];

  @OneToMany(() => Artifact, artifact => artifact.automation)
  artifacts: Artifact[];

  @OneToMany(() => TestData, testData => testData.automation)
  test_data: TestData[];
}
