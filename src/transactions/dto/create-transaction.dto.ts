import { IsNotEmpty, IsString, IsOptional, IsDateString, IsNumber, IsUUID, IsIn } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['gasto', 'ingreso'])
  type: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
