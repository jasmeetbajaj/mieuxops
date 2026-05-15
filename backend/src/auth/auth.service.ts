import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/entities/user.entity';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('Account is deactivated');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    user.lastLoginAt = new Date();
    await this.usersRepo.save(user);

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      department: user.department,
    });

    const { password, passwordResetToken, ...safe } = user as any;
    return { accessToken: token, user: safe };
  }

  async register(dto: RegisterDto) {
    const exists = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 12);
    const user = this.usersRepo.create({
      ...dto,
      password: hashed,
    } as any);
    await this.usersRepo.save(user);

    const { password, ...safe } = user as any;
    return safe;
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (!user) return { message: 'If that email exists, a reset link was sent.' };

    const token = uuidv4();
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1hr
    await this.usersRepo.save(user);

    // TODO: send email with token
    return { message: 'Password reset link sent.', debug_token: token };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersRepo.findOne({
      where: { passwordResetToken: dto.token },
    });
    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    user.password = await bcrypt.hash(dto.newPassword, 12);
    user.passwordResetToken = null as any;
    user.passwordResetExpires = null as any;
    await this.usersRepo.save(user);
    return { message: 'Password updated successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const { password, passwordResetToken, ...safe } = user as any;
    return safe;
  }
}
