import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard
 * Protects routes that require JWT token authentication
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
