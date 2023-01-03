// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config'
// import { PrismaClient } from '@prisma/client';

// @Injectable()
// export class PrismaService extends PrismaClient {
//     constructor(private readonly config: ConfigService) {
//         super({
//             datasources: {
//                 db: {
//                     url: config.get('DATABASE_URL')
//                 }
//             }
//         })
//     }
// }


// prisma との連携公式ドキュメント: https://docs.nestjs.com/recipes/prisma
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }
}