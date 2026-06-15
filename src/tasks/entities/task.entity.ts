import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  userEmail?: string;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE', nullable: true })
  user?: User;

  @ManyToOne(() => Category, (category) => category.tasks, { onDelete: 'SET NULL', nullable: true })
  category?: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
