import { IsEmail, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString() @MaxLength(120) name!: string;
  @IsEmail() email!: string;
  @IsString() @MaxLength(5000) message!: string;
}
