import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return this.usersService.create(email, hashed);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return { message: 'Si el correo existe, se envió un enlace' };

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpires = new Date(Date.now() + 1000 * 60 * 30);
    await this.usersService.save(user);

    return { message: 'Si el correo existe, se envió un enlace', token };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);
    if (!user || user.resetTokenExpires < new Date()) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = '';
    user.resetTokenExpires = new Date('2222-10-10');
    await this.usersService.save(user);

    return { message: 'Contraseña actualizada' };
  }
}