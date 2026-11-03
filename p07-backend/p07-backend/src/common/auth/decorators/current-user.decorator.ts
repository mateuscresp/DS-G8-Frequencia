import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUser } from '../current-user.interface';

export const GetCurrentUser = createParamDecorator((_, ctx: ExecutionContext): CurrentUser => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
