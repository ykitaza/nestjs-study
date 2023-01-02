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
}
