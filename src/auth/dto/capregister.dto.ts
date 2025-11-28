// src/captain/dto/create-captain.dto.ts

import { IsEmail, IsNotEmpty, MinLength, ValidateNested, IsString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class VehicleDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    color: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    plate: string;

    @IsNumber()
    @IsNotEmpty()
    capacity: number;

    @IsEnum(['car', 'motorcycle', 'auto'], { message: 'vehicleType must be car, motorcycle, or auto' })
    vehicleType: 'car' | 'motorcycle' | 'auto';
}

export class CreateCaptainDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    firstname: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    lastname: string;

    @IsEmail({}, { message: 'Please enter a valid email' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ValidateNested()
    @Type(() => VehicleDto)
    vehicle: VehicleDto;
}
