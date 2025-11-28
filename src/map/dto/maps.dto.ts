import { IsNotEmpty, IsString } from 'class-validator';

export class GetCoordinatesDto {
    @IsNotEmpty()
    @IsString()
    address: string;
}

export class GetDistanceTimeDto {
    @IsNotEmpty()
    @IsString()
    origin: string;

    @IsNotEmpty()
    @IsString()
    destination: string;
}

export class AutoCompleteDto {
    @IsNotEmpty()
    @IsString()
    input: string;
}
