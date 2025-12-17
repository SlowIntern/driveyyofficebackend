import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CoordinateDto {
    @IsNumber()
    lat: number;

    @IsNumber()
    lng: number;
}

export class CreateServiceAreaDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CoordinateDto)
    coordinates: CoordinateDto[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    createdBy?: string;
}
