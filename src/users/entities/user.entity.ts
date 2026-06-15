import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Saving } from '../../savings/entities/saving.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password?: string; // Simple plain-text/hashed password matching for this application

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Saving, (saving) => saving.user)
  savings: Saving[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
