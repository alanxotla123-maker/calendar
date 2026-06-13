import { IsNotEmpty, IsString, IsOptional, IsHexColor } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @IsHexColor()
  color?: string;
}
