import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

class AuthDto {
    email;
    passpars;
}

const auth = new AuthDto()
auth.email = 'test@google.com'
console.log(auth)