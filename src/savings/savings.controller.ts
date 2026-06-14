import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Headers } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { CreateSavingDto } from './dto/create-saving.dto';
import { UpdateSavingDto } from './dto/update-saving.dto';

@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Post()
  create(@Body() createSavingDto: CreateSavingDto, @Headers('x-user-email') userEmail?: string) {
    return this.savingsService.create(createSavingDto, userEmail);
  }

  @Get()
  findAll(@Headers('x-user-email') userEmail?: string) {
    return this.savingsService.findAll(userEmail);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Headers('x-user-email') userEmail?: string) {
    return this.savingsService.findOne(id, userEmail);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSavingDto: UpdateSavingDto,
    @Headers('x-user-email') userEmail?: string,
  ) {
    return this.savingsService.update(id, updateSavingDto, userEmail);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Headers('x-user-email') userEmail?: string) {
    return this.savingsService.remove(id, userEmail);
  }
}
