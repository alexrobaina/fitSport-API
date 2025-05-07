import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: RegisterDto) {
    const { email, password, name, sport, goal, picture, ...profileData } =
      data;

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        picture,
        profile: {
          create: {
            goal,
            ...profileData,
            Sport: {
              connect: {
                name: sport[0],
              },
            },
          },
        },
      },
      include: {
        profile: {
          include: {
            Sport: true,
          },
        },
      },
    });
  }
}
