import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ROOT)
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.contactService.findAll(pagination);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.contactService.delete(id);
  }
}
