import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CategoriesModule } from '../categories/categories.module';
import { UsersModule } from '../users/users.module';
import { CardsModule } from '../cards/cards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    CategoriesModule,
    UsersModule,
    CardsModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
