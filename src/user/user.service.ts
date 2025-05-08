import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        UserSport: {
          include: { sport: true },
        },
      },
    });
  }

  async updateUserSettings(userId: string, dto: UpdateProfileDto) {
    const { name, picture, sports = [], ...profileData } = dto;

    // Update name and picture (basic User fields)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        name,
        picture,
      },
    });

    // Upsert the profile (create if missing, update if exists)
    await this.prisma.userProfile.upsert({
      where: { userId },
      update: { ...profileData },
      create: { userId, ...profileData },
    });

    // Handle sports list
    const sportEntities = await Promise.all(
      sports.map(sportName =>
        this.prisma.sport.upsert({
          where: { name: sportName },
          update: {},
          create: { name: sportName },
        }),
      ),
    );

    // Clear and recreate UserSport relations
    await this.prisma.userSport.deleteMany({ where: { userId } });
    await this.prisma.userSport.createMany({
      data: sportEntities.map(sport => ({
        userId,
        sportId: sport.id,
      })),
    });

    // Return updated profile
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        UserSport: {
          include: { sport: true },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: RegisterDto) {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create User and Profile
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        picture: data.picture,
        profile: {
          create: {
            age: data.age,
            weight: data.weight,
            height: data.height,
            gender: data.gender,
            goal: data.goal,
            frequency: data.frequency,
            experienceLevel: data.experienceLevel,
            dietStyle: data.dietStyle,
            allergies: data.allergies,
            injuries: data.injuries,
            preferredTime: data.preferredTime,
            aiNotes: data.aiNotes,
          },
        },
      },
    });

    // Handle sports (if any)
    if (data.sport?.length) {
      const sportRecords = await Promise.all(
        data.sport.map(name =>
          this.prisma.sport.upsert({
            where: { name },
            update: {},
            create: { name },
          }),
        ),
      );

      await this.prisma.userSport.createMany({
        data: sportRecords.map(sport => ({
          userId: user.id,
          sportId: sport.id,
        })),
      });
    }

    return user;
  }
}
