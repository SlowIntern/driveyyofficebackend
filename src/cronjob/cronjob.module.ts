import { Module } from '@nestjs/common';
import { CronjobService } from './cronjob.service';
import { TwilioService } from 'src/twilio/twilio.service';

@Module({

  providers: [CronjobService,TwilioService]
})
export class CronjobModule {}
