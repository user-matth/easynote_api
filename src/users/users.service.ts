import { Injectable, ConflictException, HttpException, InternalServerErrorException, NotFoundException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"

interface SignupParams {
  login: string;
  password: string;
  name: string;
  surname: string;
  role: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) { }

  async create({ login, password, name, surname }: SignupParams) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10)
      const users = await this.prismaService.user.create({
        data: {
          login,
          password: hashedPassword,
          name,
          surname
        },
      })
      return { token: this.generateJWT(users.id, login) };
    } catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private generateJWT(id: number, login: string) {
    return jwt.sign(
      { id, login }, 
      `${process.env.JWT_KEY}`, 
      { expiresIn: "1h" }
    )
  }

}
