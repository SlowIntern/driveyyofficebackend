import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/user/schema/user.schema';


export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsEnum(UserRole, { message: 'Role must be user, captain, or admin' })
    role: UserRole;
}
