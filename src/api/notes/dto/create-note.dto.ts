import { IsString, IsNotEmpty, IsEmail, MinLength, Matches, IsEnum, IsOptional, isString, IsNumber } from "@nestjs/class-validator"

export class CreateNoteDto {
    @IsNotEmpty()
    title: string

    description: string
    status: boolean
    user_id: number
}

export class ResponseNoteDto {
    @IsNotEmpty()
    title: string
    description: string
    status: boolean
    user_id: number
    blocks: {
        type: string;
        version: string;
        data: {
            text: string;
        };
    }[];
    constructor(partial: Partial<ResponseNoteDto>) {
        Object.assign(this, partial)
    }
}
