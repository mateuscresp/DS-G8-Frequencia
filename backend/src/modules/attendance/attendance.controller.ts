import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessRole } from '../../common/auth/access-role.enum';
import type { CurrentUser } from '../../common/auth/current-user.interface';
import { GetCurrentUser } from '../../common/auth/decorators/current-user.decorator';
import { Roles } from '../../common/auth/decorators/roles.decorator';
import { CorrectionDto, OpenCallDto, RegisterDto } from './attendance.dto';
import { AttendanceService } from './attendance.service';

@ApiTags('Chamadas e presenças')
@ApiBearerAuth()
@Controller()
export class AttendanceController {
  constructor(private readonly attendance: AttendanceService) {}
  @Get('calls')
  list(
    @GetCurrentUser() user: CurrentUser,
    @Query('classId', new ParseUUIDPipe({ optional: true })) classId?: string,
  ) {
    return this.attendance.list(user, classId);
  }
  @Post('classes/:id/calls')
  @Roles(AccessRole.PROFESSOR, AccessRole.ADMIN)
  open(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: OpenCallDto,
    @GetCurrentUser() user: CurrentUser,
  ) {
    return this.attendance.open(id, body.minutes, user);
  }
  @Post('calls/:id/close')
  @Roles(AccessRole.PROFESSOR, AccessRole.ADMIN)
  close(@Param('id', ParseUUIDPipe) id: string, @GetCurrentUser() user: CurrentUser) {
    return this.attendance.close(id, user);
  }
  @Post('attendance')
  @Roles(AccessRole.STUDENT)
  register(@Body() body: RegisterDto, @GetCurrentUser() user: CurrentUser) {
    return this.attendance.register(body.code, user);
  }
  @Patch('calls/:id/attendance/:studentId')
  @Roles(AccessRole.PROFESSOR, AccessRole.ADMIN)
  correct(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('studentId') studentId: string,
    @Body() body: CorrectionDto,
    @GetCurrentUser() user: CurrentUser,
  ) {
    return this.attendance.correct(id, studentId, body.status, user);
  }
}
