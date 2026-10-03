import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString() title!: string;
  @IsString() slug!: string;
  @IsString() coverImage!: string;
  @IsArray() @IsString({ each: true }) gallery!: string[];
  @IsArray() @IsString({ each: true }) techTags!: string[];
  @IsString() summary!: string;
  @IsString() caseStudy!: string;
  @IsOptional() @IsString() liveUrl?: string;
  @IsOptional() @IsString() githubUrl?: string;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsInt() order?: number;
}

export class UpdateProjectDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) gallery?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) techTags?: string[];
  @IsOptional() @IsString() summary?: string;
  @IsOptional() @IsString() caseStudy?: string;
  @IsOptional() @IsString() liveUrl?: string;
  @IsOptional() @IsString() githubUrl?: string;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsInt() order?: number;
}
