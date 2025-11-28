import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum UserRole {
    USER = 'user',
    CAPTAIN = 'captain',
}

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsEnum(UserRole, { message: 'Role must be either user or captain' })
    role: UserRole;
}
