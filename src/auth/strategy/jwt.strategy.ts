import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt1') {
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService
    ) {
        // passportStrategy: https://docs.nestjs.com/security/authentication
        super({
            // jwtをrequestのどこから取得するか: https://github.com/mikenicholson/passport-jwt#configure-strategy
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                    let jwt = null;
                    if (req && req.cookies) {
                        jwt = req.cookies['access_token']
                    }
                    return jwt
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_SECRET')
        })
    }

    // payload はjwtとsecretから復元されるオブジェクト。jwt発行したときのpayloadと一致する。
    async validate(payload: { sub: number, email: string }) {
        console.log('run validate')
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });
        delete user.hashedPassword
        return user
    }
}