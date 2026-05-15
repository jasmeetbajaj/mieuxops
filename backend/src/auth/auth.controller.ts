import {
  Controller, Post, Get, Body, Request, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user (Super Admin only via API)' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}
