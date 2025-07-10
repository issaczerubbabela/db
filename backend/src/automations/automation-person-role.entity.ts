import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm';
import { Automation } from './automation.entity';
import { Person } from '../people/person.entity';

@Entity('automation_people_roles')
@Unique(['automation_id', 'person_id', 'role'])
export class AutomationPersonRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  automation_id: string;

  @Column()
  person_id: number;

  @Column({ length: 100 })
  role: string;

  @CreateDateColumn()
  created_at: Date;

  // Relations
  @ManyToOne(() => Automation, automation => automation.people_roles)
  @JoinColumn({ name: 'automation_id' })
  automation: Automation;

  @ManyToOne(() => Person)
  @JoinColumn({ name: 'person_id' })
  person: Person;
}
