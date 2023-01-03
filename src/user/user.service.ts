import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { use } from 'passport';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    // User情報の更新
    async updateUser(
        userid: number,
        dto: UpdateUserDto
    )
        // omit<T, Keys>について: https://typescriptbook.jp/reference/type-reuse/utility-types/omit
        // pick<T, keys>について: https://typescriptbook.jp/reference/type-reuse/utility-types/pick
        : Promise<Omit<User, 'haxhedPassword'>> {
        const user = await this.prisma.user.update({
            where: {
                id: userid
            },
            // 破壊的操作を回避するためのスプレッド構文: https://zenn.dev/cryptobox/articles/ec99edaaa16b7b
            data: {
                ...dto
            }
        })
        delete user.hashedPassword;
        return user
    }
}
