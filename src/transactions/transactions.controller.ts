import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Headers } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto, @Headers('x-user-email') userEmail?: string) {
    return this.transactionsService.create(createTransactionDto, userEmail);
  }

  @Get()
  findAll(@Headers('x-user-email') userEmail?: string) {
    return this.transactionsService.findAll(userEmail);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Headers('x-user-email') userEmail?: string) {
    return this.transactionsService.findOne(id, userEmail);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Headers('x-user-email') userEmail?: string,
  ) {
    return this.transactionsService.update(id, updateTransactionDto, userEmail);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Headers('x-user-email') userEmail?: string) {
    return this.transactionsService.remove(id, userEmail);
  }
}
