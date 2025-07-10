import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Automation } from './automation.entity';
import { Person } from '../people/person.entity';

@Entity('test_data')
export class TestData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  automation_id: string;

  @Column({ nullable: true })
  spoc_id: number;

  @Column({ type: 'text', nullable: true })
  data_location: string;

  @Column({ type: 'text', nullable: true })
  data_description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Automation, automation => automation.test_data)
  @JoinColumn({ name: 'automation_id' })
  automation: Automation;

  @ManyToOne(() => Person, { nullable: true })
  @JoinColumn({ name: 'spoc_id' })
  spoc: Person;
}
