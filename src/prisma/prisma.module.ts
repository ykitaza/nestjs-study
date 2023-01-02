import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  // prismaServiceを別モジュールで使用できるようにexportsする
  exports: [PrismaService]
})
export class PrismaModule { }
