import { IsArray, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateExperienceDto {
  @IsString() company!: string;
  @IsOptional() @IsString() companyUrl?: string;
  @IsString() role!: string;
  @IsDateString() startDate!: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsArray() @IsString({ each: true }) bullets!: string[];
  @IsOptional() @IsInt() order?: number;
}

export class UpdateExperienceDto {
  @IsOptional() @IsString() company?: string;
  @IsOptional() @IsString() companyUrl?: string;
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) bullets?: string[];
  @IsOptional() @IsInt() order?: number;
}
