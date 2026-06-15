import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CategoriesService } from '../categories/categories.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly categoriesService: CategoriesService,
    private readonly usersService: UsersService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userEmail?: string): Promise<Task> {
    const { categoryId, ...taskData } = createTaskDto;
    const task = this.taskRepository.create({ ...taskData, userEmail });

    if (userEmail) {
      const user = await this.usersService.findByEmail(userEmail);
      if (user) {
        task.user = user;
      }
    }

    if (categoryId) {
      task.category = await this.categoriesService.findOne(categoryId);
    }

    return await this.taskRepository.save(task);
  }

  async findAll(userEmail?: string): Promise<Task[]> {
    const whereClause = userEmail ? { userEmail } : {};
    return await this.taskRepository.find({
      where: whereClause,
      relations: { category: true },
      order: {
        dueDate: {
          direction: 'ASC',
          nulls: 'LAST',
        } as any,
      },
    });
  }

  async findOne(id: string, userEmail?: string): Promise<Task> {
    const whereClause = userEmail ? { id, userEmail } : { id };
    const task = await this.taskRepository.findOne({
      where: whereClause,
      relations: { category: true },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userEmail?: string): Promise<Task> {
    const { categoryId, ...taskData } = updateTaskDto;
    const task = await this.findOne(id, userEmail);

    this.taskRepository.merge(task, taskData);

    if (categoryId !== undefined) {
      task.category = categoryId ? await this.categoriesService.findOne(categoryId) : undefined;
    }

    return await this.taskRepository.save(task);
  }

  async remove(id: string, userEmail?: string): Promise<void> {
    const task = await this.findOne(id, userEmail);
    await this.taskRepository.remove(task);
  }
}
