import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() headline?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() photoUrl?: string;
  @IsOptional() @IsString() aboutPhotoUrl?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsBoolean() openToWork?: boolean;
  @IsOptional() @IsString() resumeUrl?: string;
  @IsOptional() @IsString() linkedin?: string;
  @IsOptional() @IsString() github?: string;
  @IsOptional() @IsEmail() email?: string;
}
