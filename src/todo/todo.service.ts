import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';

@Injectable()
export class TodoService {
    constructor(private readonly prisma: PrismaService) { }

    // ログインしているユーザーのtask一覧を取得
    getTasks(userId: number): Promise<Task[]> {
        return this.prisma.task.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }

    // taskidに一致するタスクを取得する
    //prisma reference:  https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#get-the-user-record-with-firstname-of-alice-and-lastname-of-smith-unique
    getTaskById(userId: number, taskId: number): Promise<Task> {
        return this.prisma.task.findFirst({
            where: {
                userId,
                id: taskId
            }
        })
    }

    async createTask(userId: number, dto: CreateTaskDto): Promise<Task> {
        const task = this.prisma.task.create({
            data: {
                userId,
                ...dto
            }
        })
        return task
    }

    // taskを更新
    async updateTaskById(
        userId: number,
        taskId: number,
        dto: UpdateTaskDto,
    ): Promise<Task> {
        const task = await this.prisma.task.findUnique({
            where: {
                id: taskId
            },
        })
        if (!task || task.userId !== userId) throw new ForbiddenException('No permision to update');
        return this.prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                ...dto
            },
        })
    }

    async deleteTaskById(
        userId: number,
        taskId: number,
    ): Promise<Task> {
        const task = await this.prisma.task.findUnique({
            where: {
                id: taskId
            },
        })
        if (!task || task.userId !== userId) throw new ForbiddenException('No permision to delete');

        return this.prisma.task.delete({
            where: {
                id: taskId
            },
        })
    }

}
