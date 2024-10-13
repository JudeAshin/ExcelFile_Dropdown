import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseInterceptors, UploadedFile, ParseFilePipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Response } from "express";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Normal post methos to create a user

  @Post()
  create(@Body() createUserDto: CreateUserDto):Promise<User> {
    return this.usersService.create(createUserDto);
  }

  // Excel sheet generation to get bulk of data's from users.

  @Get('sampleCustomerExcelSheet')
  async downloadExcel(@Res() response: Response) {
    try {
      await this.usersService.generateExcelFile(response);
    } catch (error) {
      console.error('Error generating Excel file:', error.message);
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
