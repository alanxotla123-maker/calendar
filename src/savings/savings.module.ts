import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saving } from './entities/saving.entity';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Saving]),
    CategoriesModule,
  ],
  controllers: [SavingsController],
  providers: [SavingsService],
})
export class SavingsModule {}
