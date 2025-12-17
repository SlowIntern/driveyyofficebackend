import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceArea } from './schema/service.schema';
import { Model } from 'mongoose';
import { CreateServiceAreaDto } from './dto/service.dto';

@Injectable()
export class ServiceAreaService {

    constructor(@InjectModel(ServiceArea.name) private readonly serviceModel: Model<ServiceArea>) { }
    

    async create(dto: CreateServiceAreaDto) {
        return this.serviceModel.create(dto);
    }


    // service-area.service.ts
    async findAll() {
        return this.serviceModel.find({ isActive: true }).lean();
    }


}
