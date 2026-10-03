import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ChangeCredentialsDto {
  @IsString()
  currentPassword!: string;

  @IsOptional()
  @IsEmail()
  newEmail?: string;

  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'New password must be at least 10 characters' })
  @MaxLength(72, { message: 'New password must be at most 72 characters' })
  newPassword?: string;
}
