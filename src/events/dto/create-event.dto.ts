import { IsDateString, IsNotEmpty, IsString, Length } from 'class-validator';

export default class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255, { message: '이벤트의 이름은 최소 3글자 이상이여야 합니다' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 255, { message: '이벤트의 이름은 최소 3글자 이상이여야 합니다' })
  description: string;

  @IsDateString()
  when: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
