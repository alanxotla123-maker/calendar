import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Saving } from './entities/saving.entity';
import { CreateSavingDto } from './dto/create-saving.dto';
import { UpdateSavingDto } from './dto/update-saving.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class SavingsService {
  constructor(
    @InjectRepository(Saving)
    private readonly savingRepository: Repository<Saving>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createSavingDto: CreateSavingDto): Promise<Saving> {
    const { categoryId, ...savingData } = createSavingDto;
    const saving = this.savingRepository.create(savingData);

    if (categoryId) {
      saving.category = await this.categoriesService.findOne(categoryId);
    }

    return await this.savingRepository.save(saving);
  }

  async findAll(): Promise<Saving[]> {
    return await this.savingRepository.find({
      relations: { category: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Saving> {
    const saving = await this.savingRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!saving) {
      throw new NotFoundException(`Saving goal with ID "${id}" not found`);
    }
    return saving;
  }

  async update(id: string, updateSavingDto: UpdateSavingDto): Promise<Saving> {
    const { categoryId, ...savingData } = updateSavingDto;
    const saving = await this.findOne(id);

    this.savingRepository.merge(saving, savingData);

    if (categoryId !== undefined) {
      saving.category = categoryId ? await this.categoriesService.findOne(categoryId) : undefined;
    }

    return await this.savingRepository.save(saving);
  }

  async remove(id: string): Promise<void> {
    const saving = await this.findOne(id);
    await this.savingRepository.remove(saving);
  }
}
