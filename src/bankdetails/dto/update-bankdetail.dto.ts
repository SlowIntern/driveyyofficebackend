import { PartialType } from '@nestjs/mapped-types';
import { CreateBankdetailDto } from './create-bankdetail.dto';

export class UpdateBankdetailDto extends PartialType(CreateBankdetailDto) {}
