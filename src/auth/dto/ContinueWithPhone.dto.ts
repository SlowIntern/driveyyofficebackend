import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from "src/user/schema/user.schema";

export class ContinueWithPhoneDto{

    @IsString()
    @IsNotEmpty()
    country_code: string;

    @IsString()
    @IsNotEmpty()
    phone_no: string;

     @IsEnum(UserRole, { message: 'Role must be either user or captain or admin' })
     role: UserRole;
    
    
}

