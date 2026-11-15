import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';

@Module({
  providers: [ClassesService],
  controllers: [ClassesController],
})
export class ClassesModule {}
