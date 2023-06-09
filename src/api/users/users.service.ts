import { Injectable, ConflictException, HttpException, InternalServerErrorException, NotFoundException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import { UsersResponse } from './dto/create-user.dto';

interface SignupParams {
  login: string;
  password: string;
  name: string;
  surname: string;
  role: string;
}

interface SigninParams {
  login: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) { }

  async signup({ login, password, name, surname }: SignupParams) {
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
      return { token: this.generateJWT(users.id, users.name, login) };
    } catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  async signin({ login, password }: { login: string, password: string }) {
    try {
      const user = await this.prismaService.user.findUnique({ where: { login } });

      if (!user) throw new HttpException("Usuário não encontrado!", 400);

      const hashedPassword = user.password;
      const validPassword = await bcrypt.compare(password, hashedPassword)

      if (!validPassword) throw new HttpException("Senha incorreta!", 400);

      return { token: this.generateJWT(user.id, user.name, login) }
    } catch (err) {
      throw new InternalServerErrorException(err.message)
    }
  }

  async findAll() {
    try {
      const users = await this.prismaService.user.findMany({})
      if (!users) throw new HttpException("Usuário não encontrado!", 400);
      return users.map((users) => new UsersResponse(users))
    } catch (err) {
      throw new InternalServerErrorException(err.message)
    }
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

  private generateJWT(id: number, name: string, login: string) {
    return jwt.sign(
      { id, name, login },
      `${process.env.JWT_KEY}`,
      { expiresIn: "3h" }
    )
  }

}
