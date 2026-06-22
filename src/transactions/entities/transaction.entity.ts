import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { Card } from '../../cards/entities/card.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'gasto' }) // 'gasto' | 'ingreso'
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  userEmail?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  user?: User;

  @ManyToOne(() => Category, { onDelete: 'SET NULL', nullable: true })
  category?: Category;

  @Column({ nullable: true })
  cardId?: string;

  @ManyToOne(() => Card, (card) => card.transactions, { onDelete: 'SET NULL', nullable: true })
  card?: Card;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
