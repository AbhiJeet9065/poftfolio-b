import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateSkillDto {
  @IsString() name!: string;
  @IsString() category!: string;
  @IsOptional() @IsString() logoUrl?: string;
  @IsOptional() @IsBoolean() visible?: boolean;
  @IsOptional() @IsInt() order?: number;
}

export class UpdateSkillDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() logoUrl?: string;
  @IsOptional() @IsBoolean() visible?: boolean;
  @IsOptional() @IsInt() order?: number;
}
