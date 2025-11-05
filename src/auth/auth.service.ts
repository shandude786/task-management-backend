import * as jwt from 'jsonwebtoken';
import { usersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { HttpException } from '../middleware/validation.middleware';

export class AuthService {
  private usersService = usersService;

  async register(registerDto: RegisterDto) {
    const { email, password, confirmPassword } = registerDto;

    if (password !== confirmPassword) {
      throw new HttpException(400, 'Passwords do not match');
    }

    const user = await this.usersService.create(email, password);

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.signToken(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password, rememberMe } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new HttpException(401, 'Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException(401, 'Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const expiresIn = rememberMe ? '30d' : (process.env.JWT_EXPIRES_IN || '7d');

    const accessToken = this.signToken(payload, expiresIn);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async validateUser(userId: number) {
    return this.usersService.findById(userId);
  }

  private signToken(payload: any, expiresIn?: string): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign(payload, jwtSecret, {
      expiresIn: expiresIn || process.env.JWT_EXPIRES_IN || '7d',
    });
  }
}

// Export singleton instance
export const authService = new AuthService();