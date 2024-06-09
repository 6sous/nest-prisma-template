import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import {
  ContainsLowercase,
  ContainsNumber,
  ContainsSpecialCharacter,
  ContainsUppercase,
} from 'src/auth/decorators/password-validation.decorator';

export class CreateUserDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsOptional()
  @IsString()
  pseudo: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @ContainsLowercase()
  @ContainsUppercase()
  @ContainsNumber()
  @ContainsSpecialCharacter()
  password: string;

  refreshToken?: string = null;
}
