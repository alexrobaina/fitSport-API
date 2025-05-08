// src/app.module.ts
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
import { SettingsModule } from './settings/settings.module';
@Module({
  imports: [PrismaModule, AuthModule, SettingsModule, UserModule],
})
export class AppModule {}
