import { Injectable } from '@nestjs/common';
import { CreateBankdetailDto } from './dto/create-bankdetail.dto';
import { UpdateBankdetailDto } from './dto/update-bankdetail.dto';

@Injectable()
export class BankdetailsService {
  create(createBankdetailDto: CreateBankdetailDto) {
    return 'This action adds a new bankdetail';
  }

  findAll() {
    return `This action returns all bankdetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bankdetail`;
  }

  update(id: number, updateBankdetailDto: UpdateBankdetailDto) {
    return `This action updates a #${id} bankdetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} bankdetail`;
  }
}
