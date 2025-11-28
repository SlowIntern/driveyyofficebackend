import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BankdetailsService } from './bankdetails.service';
import { CreateBankdetailDto } from './dto/create-bankdetail.dto';
import { UpdateBankdetailDto } from './dto/update-bankdetail.dto';

@Controller('bankdetails')
export class BankdetailsController {
  constructor(private readonly bankdetailsService: BankdetailsService) {}

  @Post()
  create(@Body() createBankdetailDto: CreateBankdetailDto) {
    return this.bankdetailsService.create(createBankdetailDto);
  }

  @Get()
  findAll() {
    return this.bankdetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankdetailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBankdetailDto: UpdateBankdetailDto) {
    return this.bankdetailsService.update(+id, updateBankdetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankdetailsService.remove(+id);
  }
}
