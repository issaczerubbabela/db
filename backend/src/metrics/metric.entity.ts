import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Automation } from '../automations/automation.entity';

@Entity('metrics')
export class Metric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  automation_id: string;

  @Column({ type: 'int', default: 0 })
  post_prod_total_cases: number;

  @Column({ type: 'int', default: 0 })
  post_prod_sys_ex_count: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  post_prod_success_rate: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  measurement_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Automation, automation => automation.metrics)
  @JoinColumn({ name: 'automation_id' })
  automation: Automation;
}
