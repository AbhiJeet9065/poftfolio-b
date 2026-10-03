import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateStatDto {
  @IsString() label!: string;
  @IsString() value!: string;
  @IsOptional() @IsInt() order?: number;
}

export class UpdateStatDto {
  @IsOptional() @IsString() label?: string;
  @IsOptional() @IsString() value?: string;
  @IsOptional() @IsInt() order?: number;
}
