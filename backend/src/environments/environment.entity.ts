import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { Automation } from '../automations/automation.entity';

@Entity('environments')
@Unique(['automation_id', 'type'])
export class Environment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  automation_id: string;

  @Column({ length: 20 })
  type: 'Dev' | 'QA' | 'Prod';

  @Column({ length: 100, nullable: true })
  vdi: string;

  @Column({ length: 200, nullable: true })
  service_account: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Automation, automation => automation.environments)
  @JoinColumn({ name: 'automation_id' })
  automation: Automation;
}
