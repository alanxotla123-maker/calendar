import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';

@Entity('savings')
export class Saving {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  goalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  currentAmount: number;

  @Column({ type: 'timestamp', nullable: true })
  targetDate?: Date;

  @Column({ nullable: true })
  userEmail?: string;

  @ManyToOne(() => User, (user) => user.savings, { onDelete: 'CASCADE', nullable: true })
  user?: User;

  @ManyToOne(() => Category, (category) => category.savings, { onDelete: 'SET NULL', nullable: true })
  category?: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
