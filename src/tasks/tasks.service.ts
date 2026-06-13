import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { categoryId, ...taskData } = createTaskDto;
    const task = this.taskRepository.create(taskData);

    if (categoryId) {
      task.category = await this.categoriesService.findOne(categoryId);
    }

    return await this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find({
      relations: { category: true },
      order: { dueDate: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { categoryId, ...taskData } = updateTaskDto;
    const task = await this.findOne(id);

    this.taskRepository.merge(task, taskData);

    if (categoryId !== undefined) {
      task.category = categoryId ? await this.categoriesService.findOne(categoryId) : undefined;
    }

    return await this.taskRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }
}
