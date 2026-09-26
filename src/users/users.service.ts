import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  findByResetToken(token: string) {
    return this.usersRepo.findOne({ where: { resetToken: token } });
  }

  create(email: string, hashedPassword: string) {
    const user = this.usersRepo.create({ email, password: hashedPassword });
    return this.usersRepo.save(user);
  }

  save(user: User) {
    return this.usersRepo.save(user);
  }
}