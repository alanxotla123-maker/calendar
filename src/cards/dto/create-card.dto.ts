import { IsNotEmpty, IsString, IsNumber, Min, Max, IsInt } from 'class-validator';

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  creditLimit: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(31)
  closingDay: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(31)
  dueDate: number;
}
