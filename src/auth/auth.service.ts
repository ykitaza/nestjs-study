import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Msg, Jwt } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
    // typescriptの省略記法: https://qiita.com/fumiya1753/items/260ea71c5a3d316d1473
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) { }

    async signUp(dto: AuthDto): Promise<Msg> {
        // passwordをhash化
        const hashed = await bcrypt.hash(dto.password, 12)
        try {
            await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hashedPassword: hashed,
                },
            })
            return {
                message: 'ok'
            }
        }
        catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                //prisma のエラータイプ https://www.prisma.io/docs/reference/api-reference/error-reference
                if (error.code === 'P2002') {
                    // ForbiddenException: アクセス権限がないことを通知する例外
                    throw new ForbiddenException('this email is already token')
                }
                throw error;
            }
        }
    }

    async generateJwt(userId: number, email: string): Promise<Jwt> {
        const payload = {
            sub: userId,
            email
        }
        const secret = this.config.get("JWT_SECRET")
        // jwtを発行する
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '5m',
            secret: secret
        })
        return {
            accessToken: token
        }
    }
}
