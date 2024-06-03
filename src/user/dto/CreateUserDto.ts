import {
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  pseudo: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  refreshToken?: string = null;
}
