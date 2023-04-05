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
      return { token: this.generateJWT(users.id, login) };
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

      return { token: this.generateJWT(user.id, login) }
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
