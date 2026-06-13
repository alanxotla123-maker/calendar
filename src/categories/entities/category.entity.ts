import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Saving } from '../../savings/entities/saving.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ default: '#94a3b8' })
  color: string;

  @OneToMany(() => Task, (task) => task.category)
  tasks: Task[];

  @OneToMany(() => Saving, (saving) => saving.category)
  savings: Saving[];
}
