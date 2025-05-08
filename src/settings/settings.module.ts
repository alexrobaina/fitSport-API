// src/settings/settings.module.ts
import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SettingsController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class SettingsModule {}
