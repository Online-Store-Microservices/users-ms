import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto';


@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger('UsersService');

    async onModuleInit() {
        await this.$connect();
        this.logger.log('MongoDb connected');
    }


    async findByEmail(email:string){
        try {
            return await this.user.findFirst({
                where:{email},
                select:{
                    id: true,
                    name: true,
                    email: true,
                    password: true
                }
            });
        } catch (error) {
            throw new RpcException({ 
                message: error.message, 
                status: HttpStatus.INTERNAL_SERVER_ERROR 
            });
        }
    }

    async register(registerUserDto: RegisterUserDto){
        try {
            const user = await this.findByEmail(registerUserDto.email);

            if (user) {
                throw new RpcException({
                  message: `User already exists`,
                  status: HttpStatus.BAD_REQUEST
                });
            }

            const userCreated =  await this.user.create({
                data:{
                    ...registerUserDto,
                    password: bcrypt.hashSync(registerUserDto.password, 10),
                }
            })

            return {
                status: HttpStatus.CREATED,
                message: 'Successful execution',
                data: userCreated,
            }
        } catch (error) {
            throw new RpcException({ 
                message: error.message, 
                status: error?.error?.status??HttpStatus.INTERNAL_SERVER_ERROR 
            }); 
        }
    }
}
