import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    Res,
    Req,
    Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Csrf, Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('/csrf')
    getCsrfToken(@Req() req: Request): Csrf {
        return { csrfToken: req.csrfToken() };
    }

    @Post('signup')
    signUp(@Body() dto: AuthDto): Promise<Msg> {
        return this.authService.signUp(dto)
    }

    // status200を返すためのデコレータ（デフォルトでは全て201が返る。）
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Body() dto: AuthDto,
        // passthroght: trueにすると、expressのres.cookieと、nestjsの「オブジェクトをJOSNにシリアライズする機能」を両立できる。
        @Res({ passthrough: true }) res: Response
    ): Promise<Msg> {
        const jwt = await this.authService.login(dto);
        console.log('jwt: ', jwt)
        res.cookie('access_token', jwt.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            path: "/"
        })
        return {
            message: 'success',
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ): Msg {
        // logoutAPIはaccess_tokenを空にする。
        res.cookie('access_token', '', {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            path: "/"
        })
        return {
            message: 'ok',
        }
    }
}
