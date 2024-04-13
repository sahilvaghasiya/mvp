import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from '../user.model';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z][a-z]*$/, {
    message: 'enter name in proper way',
  })
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'password must be 6 character long' })
  @IsNotEmpty()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'enter password in proper way',
  })
  password: string;

  @ApiProperty({ enum: UserRole, description: 'User role' })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}

export class OldPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  oldPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  changePasswordString: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
