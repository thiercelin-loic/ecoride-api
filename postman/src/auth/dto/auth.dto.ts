import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
export class CreateUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  firstname: string;
  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  lastname: string;
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    description:
      'User password (minimum 8 characters, must contain at least one uppercase, one lowercase, one number)',
    example: 'MySecurePassword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;
  @ApiProperty({
    description: 'User pseudo/username',
    example: 'johndoe',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  pseudo: string;
}
export class LoginUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    description: 'User password',
    example: 'MySecurePassword123',
  })
  @IsString()
  password: string;
}
export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
  @ApiProperty({
    description: 'User information',
    type: 'object',
    additionalProperties: true,
  })
  user: {
    id: number;
    email: string;
    pseudo: string;
    role: string;
    credits: number;
  };
}
