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

  async getTasks(
      filterDto: GetTasksFilterDto,
      user: User,
    ): Promise<Task[]> {
    return this.TaskRepository.getTasks(filterDto, user);
  }
  

  async getTaskById(
      id: number,
      user: User,
    ): Promise<Task> {
    const found = await this.TaskRepository.findOne({ where: { id, userId: user.id } });

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

  async deleteTask(
      id: number,
      user: User,  
    ): Promise<void> {
    const result = await this.TaskRepository.delete({ id, userId: user.id });
    
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }
  }

  async updateTaskStatus(
      id: number, 
      status: TaskStatus,
      user: User,
    ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    task.save();
    return task;
  }
}
