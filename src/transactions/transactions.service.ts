import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CategoriesService } from '../categories/categories.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly categoriesService: CategoriesService,
    private readonly usersService: UsersService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userEmail?: string): Promise<Transaction> {
    const { categoryId, ...transactionData } = createTransactionDto;
    const transaction = this.transactionRepository.create({ ...transactionData, userEmail });

    if (userEmail) {
      const user = await this.usersService.findByEmail(userEmail);
      if (user) {
        transaction.user = user;
      }
    }

    if (categoryId) {
      transaction.category = await this.categoriesService.findOne(categoryId);
    }

    return await this.transactionRepository.save(transaction);
  }

  async findAll(userEmail?: string): Promise<Transaction[]> {
    const whereClause = userEmail ? { userEmail } : {};
    return await this.transactionRepository.find({
      where: whereClause,
      relations: { category: true },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string, userEmail?: string): Promise<Transaction> {
    const whereClause = userEmail ? { id, userEmail } : { id };
    const transaction = await this.transactionRepository.findOne({
      where: whereClause,
      relations: { category: true },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID "${id}" not found`);
    }
    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto, userEmail?: string): Promise<Transaction> {
    const { categoryId, ...transactionData } = updateTransactionDto;
    const transaction = await this.findOne(id, userEmail);

    this.transactionRepository.merge(transaction, transactionData);

    if (categoryId !== undefined) {
      transaction.category = categoryId ? await this.categoriesService.findOne(categoryId) : undefined;
    }

    return await this.transactionRepository.save(transaction);
  }

  async remove(id: string, userEmail?: string): Promise<void> {
    const transaction = await this.findOne(id, userEmail);
    await this.transactionRepository.remove(transaction);
  }
}
