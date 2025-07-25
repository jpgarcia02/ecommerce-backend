import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginAuthDto {

    @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@correo.com',})
    @IsString()
    @IsEmail()
    email: string

    @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'MiContraseña123',
    })
    @IsString()
    @IsNotEmpty()
    password: string
}