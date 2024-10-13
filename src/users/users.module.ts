import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Customer } from './entities/customer.entity';

@Module({
  imports:[SequelizeModule.forFeature([User,Customer])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
