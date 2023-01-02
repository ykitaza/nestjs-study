import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from "class-validator";

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    passpars: string;
}