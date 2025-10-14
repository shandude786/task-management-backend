import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      userId,
    });
    return this.tasksRepository.save(task);
  }

  async findAll(
    userId: number,
    status?: TaskStatus,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC',
  ): Promise<Task[]> {
    const queryBuilder = this.tasksRepository
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId });

    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    if (sortBy) {
      const validSortFields = ['title', 'dueDate', 'createdAt', 'status'];
      if (validSortFields.includes(sortBy)) {
        queryBuilder.orderBy(
          `task.${sortBy}`,
          sortOrder === 'DESC' ? 'DESC' : 'ASC',
        );
      }
    } else {
      queryBuilder.orderBy('task.createdAt', 'DESC');
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    userId: number,
  ): Promise<Task> {
    const task = await this.findOne(id, userId);

    if (task.userId !== userId) {
      throw new ForbiddenException('You can only update your own tasks');
    }

    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async remove(id: number, userId: number): Promise<void> {
    const task = await this.findOne(id, userId);

    if (task.userId !== userId) {
      throw new ForbiddenException('You can only delete your own tasks');
    }

    await this.tasksRepository.remove(task);
  }
}