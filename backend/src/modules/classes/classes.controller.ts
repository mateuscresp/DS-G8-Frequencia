import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessRole } from '../../common/auth/access-role.enum';
import type { CurrentUser } from '../../common/auth/current-user.interface';
import { GetCurrentUser } from '../../common/auth/decorators/current-user.decorator';
import { Roles } from '../../common/auth/decorators/roles.decorator';
import { ClassesService } from './classes.service';

@ApiTags('Classes')
@ApiBearerAuth()
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}
  @Get()
  findAll(@GetCurrentUser() user: CurrentUser) {
    return this.classesService.findAll(user);
  }
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetCurrentUser() user: CurrentUser) {
    return this.classesService.findById(id, user);
  }
  @Get(':id/students')
  @Roles(AccessRole.ADMIN, AccessRole.PROFESSOR)
  getStudents(@Param('id', ParseUUIDPipe) id: string, @GetCurrentUser() user: CurrentUser) {
    return this.classesService.findStudentsInClass(id, user);
  }
}
