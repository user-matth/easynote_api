import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    execute_raw(arg0: number, Post: any, WHERE: any, published: any, IS: any, TRUE: any) {
        throw new Error('Method not implemented.');
    }
    async onModuleInit() {
        await this.$connect
    }

    async onModuleDestroy() {
        await this.$disconnect
    }

}