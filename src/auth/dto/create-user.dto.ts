import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @Length(4)
  public username: string;

  @Length(6)
  public password: string;

  @Length(6)
  public retypedPassword: string;

  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;
}
