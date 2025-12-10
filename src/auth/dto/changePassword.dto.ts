import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from "src/user/schema/user.schema";

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

    @IsEnum(UserRole, { message: 'Role must be either user or captain or admin' })
    role: UserRole;

}