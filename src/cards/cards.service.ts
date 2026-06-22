import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly usersService: UsersService,
  ) {}

  async create(createCardDto: CreateCardDto, userEmail?: string): Promise<Card> {
    const card = this.cardRepository.create({ ...createCardDto, userEmail });

    if (userEmail) {
      const user = await this.usersService.findByEmail(userEmail);
      if (user) {
        card.user = user;
      }
    }

    return await this.cardRepository.save(card);
  }

  async findAll(userEmail?: string): Promise<Card[]> {
    const whereClause = userEmail ? { userEmail } : {};
    return await this.cardRepository.find({
      where: whereClause,
      relations: { transactions: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userEmail?: string): Promise<Card> {
    const whereClause = userEmail ? { id, userEmail } : { id };
    const card = await this.cardRepository.findOne({
      where: whereClause,
      relations: { transactions: true },
    });
    if (!card) {
      throw new NotFoundException(`Card with ID "${id}" not found`);
    }
    return card;
  }

  async update(id: string, updateCardDto: UpdateCardDto, userEmail?: string): Promise<Card> {
    const card = await this.findOne(id, userEmail);
    this.cardRepository.merge(card, updateCardDto);
    return await this.cardRepository.save(card);
  }

  async remove(id: string, userEmail?: string): Promise<void> {
    const card = await this.findOne(id, userEmail);
    await this.cardRepository.remove(card);
  }
}
