import {
  IsOptional,
  IsString,
  IsInt,
  IsNumber,
  IsArray,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  goal?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sports?: string[];

  @IsOptional()
  @IsString()
  frequency?: string;

  @IsOptional()
  @IsString()
  experienceLevel?: string;

  @IsOptional()
  @IsString()
  dietStyle?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  injuries?: string;

  @IsOptional()
  @IsString()
  preferredTime?: string;

  @IsOptional()
  @IsString()
  aiNotes?: string;
}
