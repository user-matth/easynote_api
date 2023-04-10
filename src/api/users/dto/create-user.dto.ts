import { IsString, IsNotEmpty, IsEmail, MinLength, Matches, IsEnum, IsOptional, isString, IsNumber } from "@nestjs/class-validator"

export class SignUpDto {
    @IsNotEmpty()
    login: string
    @IsNotEmpty()
    password: string
    name: string
    surname: string
    role: string
}

export class SignInDto {
    @IsEmail({}, { message: 'E-mail inválido' })
    login: string;
    @MinLength(6, { message: 'Senha deve ser maior que seis digitos.' })
    password: string;
}

export class UsersResponse {
    name: string
    surname: string
    role: string
    constructor(partial: Partial<UsersResponse>) {
        Object.assign(this, partial)
    }
}