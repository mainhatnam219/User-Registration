import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateTokens(userId: string, email: string) {
    const payload = {
      sub: userId,
      email: email,
      iat: Math.floor(Date.now() / 1000),
    };

    const accessTokenExpiry = this.configService.get('JWT_ACCESS_TOKEN_EXPIRY') || '15m';
    const refreshTokenExpiry = this.configService.get('JWT_REFRESH_TOKEN_EXPIRY') || '7d';

    const accessToken = this.jwtService.sign(payload, { expiresIn: accessTokenExpiry });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: refreshTokenExpiry });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 900, // 15 minutes in seconds
    };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const accessTokenExpiry = this.configService.get('JWT_ACCESS_TOKEN_EXPIRY') || '15m';
      
      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email },
        { expiresIn: accessTokenExpiry }
      );
      return {
        access_token: newAccessToken,
        expires_in: 900,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
