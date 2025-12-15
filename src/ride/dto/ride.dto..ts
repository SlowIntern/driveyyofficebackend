import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRideDto {
    @IsNotEmpty()
    @IsString()
    pickup: string;

    @IsNotEmpty()
    @IsString()
    destination: string;

    @IsNotEmpty()
    @IsString()
    vehicleType: 'auto' | 'car' | 'moto';

    @IsNotEmpty()
    @IsString()
    rideType?: 'return' | 'simple';
}

export class ConfirmRideDto {
    @IsNotEmpty()
    @IsString()
    rideId: string;
}

export class EndRideDto {
    @IsNotEmpty()
    @IsString()
    rideId: string;
}
