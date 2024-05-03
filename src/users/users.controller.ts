import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailUserDto, RegisterUserDto } from './dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('register_user')
  registerUser(@Payload() registerUserDto: RegisterUserDto){
    return this.usersService.register(registerUserDto)
  }

  @MessagePattern('find_user_by_email')
  finByEmail(@Payload() emailUserDto: EmailUserDto){
    return this.usersService.findByEmail(emailUserDto.email)
  }
}
