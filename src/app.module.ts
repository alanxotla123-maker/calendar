import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { TasksModule } from './tasks/tasks.module';
import { SavingsModule } from './savings/savings.module';

@Module({
  imports: [CategoriesModule, TasksModule, SavingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
