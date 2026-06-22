import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Headers } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto, @Headers('x-user-email') userEmail?: string) {
    return this.cardsService.create(createCardDto, userEmail);
  }

  @Get()
  findAll(@Headers('x-user-email') userEmail?: string) {
    return this.cardsService.findAll(userEmail);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Headers('x-user-email') userEmail?: string) {
    return this.cardsService.findOne(id, userEmail);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCardDto: UpdateCardDto,
    @Headers('x-user-email') userEmail?: string,
  ) {
    return this.cardsService.update(id, updateCardDto, userEmail);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Headers('x-user-email') userEmail?: string) {
    return this.cardsService.remove(id, userEmail);
  }
}
