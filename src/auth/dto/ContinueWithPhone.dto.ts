import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from "./login.dto";

export class ContinueWithPhoneDto{

    @IsString()
    @IsNotEmpty()
    country_code: string;

    @IsString()
    @IsNotEmpty()
    phone_no: string;

     @IsEnum(UserRole, { message: 'Role must be either user or captain' })
     role: UserRole;
    
    
}

