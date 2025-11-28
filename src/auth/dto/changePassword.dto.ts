import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from "./login.dto";

export class ChangePasswordDto{
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @IsString()
    @IsNotEmpty()
    newPassword: string;

    @IsEnum(UserRole, { message: 'Role must be either user or captain' })
    role: UserRole;

}