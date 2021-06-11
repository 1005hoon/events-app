import { AuthService } from './auth.service';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authsService: AuthService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException(['비밀번호를 확인해주세요']);
    }

    const user = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (user) {
      throw new BadRequestException(
        '이미 사용중인 이메일이거나 사용자 이름 입니다',
      );
    }

    const hashedPassword = await this.authsService.hashPassword(
      createUserDto.password,
    );

    const newUser = new User();
    newUser.username = createUserDto.username;
    newUser.password = hashedPassword;
    newUser.email = createUserDto.email;
    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;

    return {
      ...(await this.usersRepository.save(newUser)),
      token: this.authsService.getTokenForUser(newUser),
    };
  }
}
