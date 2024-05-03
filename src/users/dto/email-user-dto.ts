import { IsEmail, IsString } from "class-validator";

export class EmailUserDto {
    @IsString()
    @IsEmail()
    email:string;
}
