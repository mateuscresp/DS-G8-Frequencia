import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all classes' })
  async findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get class by ID' })
  async findOne(@Param('id') id: string) {
    return this.classesService.findById(id);
  }

  @Get(':id/students')
  @Public()
  @ApiOperation({ summary: 'Get students enrolled in a class' })
  async getStudents(@Param('id') classId: string) {
    return this.classesService.findStudentsInClass(classId);
  }
}
