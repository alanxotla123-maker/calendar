import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<Omit<User, 'password'>> {
    const { email, name, password } = registerUserDto;
    const sanitizedEmail = email.trim().toLowerCase();

    const existingUser = await this.userRepository.findOne({ where: { email: sanitizedEmail } });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado.');
    }

    const user = this.userRepository.create({
      email: sanitizedEmail,
      name,
      password, // Simple storage for development. In production, hash with bcrypt/argon2.
    });

    const savedUser = await this.userRepository.save(user);
    const { password: _, ...result } = savedUser;
    return result;
  }

  async login(loginUserDto: LoginUserDto): Promise<Omit<User, 'password'>> {
    const { email, password } = loginUserDto;
    const sanitizedEmail = email.trim().toLowerCase();

    const user = await this.userRepository.findOne({ where: { email: sanitizedEmail } });
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas. Por favor, verifica tu correo y contraseña.');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Credenciales incorrectas. Por favor, verifica tu correo y contraseña.');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email: email.trim().toLowerCase() } });
  }
}
