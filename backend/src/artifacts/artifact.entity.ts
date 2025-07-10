import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Automation } from '../automations/automation.entity';

@Entity('artifacts')
export class Artifact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  automation_id: string;

  @Column({ type: 'text', nullable: true })
  artifacts_link: string;

  @Column({ length: 50, nullable: true })
  code_review: string;

  @Column({ length: 50, nullable: true })
  demo: string;

  @Column({ type: 'text', nullable: true })
  rampup_issue_list: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Automation, automation => automation.artifacts)
  @JoinColumn({ name: 'automation_id' })
  automation: Automation;
}
