import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saving } from './entities/saving.entity';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';
import { CategoriesModule } from '../categories/categories.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Saving]),
    CategoriesModule,
    UsersModule,
  ],
  controllers: [SavingsController],
  providers: [SavingsService],
})
export class SavingsModule {}
