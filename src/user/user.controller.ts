import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

// starategy の名前を指定する。
@UseGuards(AuthGuard('jwt1'))
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    getLoginUser(@Req() req: Request): Omit<User, 'hashedPassword'> {
        // console.log(req)
        return req.user
    }

    @Patch()
    updateUser(
        @Req() req: Request,
        @Body() dto: UpdateUserDto,
    ): Promise<Omit<User, 'hashedPassword'>> {
        return this.userService.updateUser(req.user.id, dto)
    }
}
