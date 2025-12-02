import { Controller } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';

@Controller('razorpay')
export class RazorpayController {
  constructor(private readonly razorpayService: RazorpayService) {}
}
