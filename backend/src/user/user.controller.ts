import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from '../auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    if (!registerDto.email || !registerDto.password) {
      throw new BadRequestException('Email and password are required');
    }

    return await this.userService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    if (!loginDto.email || !loginDto.password) {
      throw new BadRequestException('Email and password are required');
    }

    return await this.userService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    return this.authService.refreshAccessToken(refreshToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req: any) {
    const userId = req.user.sub; // JWT payload has 'sub' (subject) = userId
    console.log('[API] Getting user profile for ID:', userId);
    
    const user = await this.userService.getUserById(userId);
    
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Return only id and email (don't expose password)
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
