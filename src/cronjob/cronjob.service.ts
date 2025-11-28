import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TwilioService } from 'src/twilio/twilio.service';

@Injectable()
export class CronjobService {
    constructor(private twilio:TwilioService) { }

}
