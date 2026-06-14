import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Headers } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Headers('x-user-email') userEmail?: string) {
    return this.tasksService.create(createTaskDto, userEmail);
  }

  @Get()
  findAll(@Headers('x-user-email') userEmail?: string) {
    return this.tasksService.findAll(userEmail);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Headers('x-user-email') userEmail?: string) {
    return this.tasksService.findOne(id, userEmail);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Headers('x-user-email') userEmail?: string,
  ) {
    return this.tasksService.update(id, updateTaskDto, userEmail);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Headers('x-user-email') userEmail?: string) {
    return this.tasksService.remove(id, userEmail);
  }
}
