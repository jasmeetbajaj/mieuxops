import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findAll(query?: { role?: string; department?: string; search?: string }) {
    const where: any = {};
    if (query?.role) where.role = query.role;
    if (query?.department) where.department = query.department;

    const users = await this.usersRepo.find({
      where,
      order: { createdAt: 'DESC' },
      select: ['id', 'firstName', 'lastName', 'email', 'role', 'department', 'isActive', 'lastLoginAt', 'createdAt'],
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findOne({
      where: { id },
      select: ['id', 'firstName', 'lastName', 'email', 'role', 'department', 'isActive', 'phone', 'avatar', 'lastLoginAt', 'createdAt'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: Partial<User>) {
    const exists = await this.usersRepo.findOne({ where: { email: data.email } });
    if (exists) throw new ConflictException('Email already in use');
    const hashed = await bcrypt.hash(data.password || 'Mieux@2026', 12);
    const user = this.usersRepo.create({ ...data, password: hashed });
    return this.usersRepo.save(user);
  }

  async update(id: string, data: Partial<User>) {
    const user = await this.findOne(id);
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }
    Object.assign(user, data);
    return this.usersRepo.save(user);
  }

  async deactivate(id: string) {
    await this.usersRepo.update(id, { isActive: false });
    return { message: 'User deactivated' };
  }

  async activate(id: string) {
    await this.usersRepo.update(id, { isActive: true });
    return { message: 'User activated' };
  }
}
