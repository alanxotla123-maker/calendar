import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDateString, IsUUID, Min } from 'class-validator';

export class CreateSavingDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  goalAmount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentAmount?: number;

  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
