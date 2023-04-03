import { IsNotEmpty } from "@nestjs/class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    login: string
    @IsNotEmpty()
    password: string
    name: string
    surname: string
    role: string
}
