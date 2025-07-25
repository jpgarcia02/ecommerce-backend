import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Param decorator to extract the userId (sub) from the validated JWT payload
 */
export const GetUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user.sub;
  }
);
