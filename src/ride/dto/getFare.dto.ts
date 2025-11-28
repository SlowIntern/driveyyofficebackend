import { IsNotEmpty, IsString } from "class-validator";

export class FareDto{
    @IsString()
    @IsNotEmpty()
    pickup: string;

    @IsString()
    @IsNotEmpty()
    destination: string;
}