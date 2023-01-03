import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';


@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    getLoginUser(@Req() req: Request): Omit<User, 'hashedPassword'> {
        console.log(req)
        return req.user
    }

    @Patch()
    updateUser(
        @Req() req: Request,
        @Body() dto: UpdateUserDto,
    ): Promise<Omit<User, 'hashedPassowrd'>> {
        return this.userService.updateUser(req.user.id, dto)
    }
}
