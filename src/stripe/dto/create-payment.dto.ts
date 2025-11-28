import { IsNotEmpty } from "class-validator";

export class CreatePaymentIntentDto
{
    @IsNotEmpty()
    amount: number;
    @IsNotEmpty()
    currency: string
}