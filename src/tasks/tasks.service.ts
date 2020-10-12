import { Delete, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { User } from '../auth/user.entity';


@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private TaskRepository: TaskRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.TaskRepository.getTasks(filterDto);
  }
  

  async getTaskById(id: number): Promise<Task> {
    const found = await this.TaskRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }
    return found;
  }

  async createTask(
    CreateTaskDto: CreateTaskDto,
    user: User,
    ): Promise<Task> {
    return this.TaskRepository.createTask(CreateTaskDto, user);
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.TaskRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    task.save();
    return task;
  }
}
