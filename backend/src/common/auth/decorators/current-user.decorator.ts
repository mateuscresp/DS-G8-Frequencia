import { type ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';
import type { CurrentUser } from '../current-user.interface';

export const GetCurrentUser = createParamDecorator(
  (_, context: ExecutionContext): CurrentUser | undefined => {
    const request = context.switchToHttp().getRequest<Request>();
    return request.user;
  },
);
