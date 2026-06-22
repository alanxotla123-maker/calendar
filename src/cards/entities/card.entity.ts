import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  creditLimit: number;

  @Column({ type: 'int', default: 15 })
  closingDay: number;

  @Column({ type: 'int', default: 5 })
  dueDate: number;

  @Column({ nullable: true })
  userEmail?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  user?: User;

  @OneToMany(() => Transaction, (transaction) => transaction.card)
  transactions?: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
