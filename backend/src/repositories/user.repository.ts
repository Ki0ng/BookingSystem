import prisma from '../config/db.config';
import { User, Prisma } from '@prisma/client';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { googleId } });
  }

  async update(userId: string, userUpdateData: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: userUpdateData,
    });
  }

  async create(userData: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data: userData });
  }

  async upsertVerificationCode(email: string, hashedCode: string, expires: Date): Promise<User> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      return this.update(existingUser.id, {
        verificationCode: hashedCode,
        verificationCodeExpires: expires,
      });
    } else {
      return this.create({
        email,
        verificationCode: hashedCode,
        verificationCodeExpires: expires,
        role: 'USER',
      });
    }
  }

  async clearVerificationCode(userId: string): Promise<User> {
    return this.update(userId, {
      verificationCode: null,
      verificationCodeExpires: null,
    });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<User> {
    return this.update(userId, { password_hash: passwordHash });
  }
}
