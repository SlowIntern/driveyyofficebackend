import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class DeleteDto{
    @IsNotEmpty()
    @IsEmail()
    email: string
    
    @IsNotEmpty()
    @IsString()
    password: string
    
    @IsNotEmpty()
    @IsString()
    reason: string;
}