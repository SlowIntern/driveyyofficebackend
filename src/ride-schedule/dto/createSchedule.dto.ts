import { IsDate, IsNotEmpty, IsString } from "class-validator"

export class ScheduleDto {
    @IsNotEmpty()
    @IsString()
    pickup: string
    @IsNotEmpty()
    @IsString()
    destination: string

    @IsDate()
    @IsString()
    date: string
    
    @IsNotEmpty()
    @IsString()
    time: string


    @IsNotEmpty()
    @IsString()
    vehicleType: 'auto' | 'car' | 'moto';
}