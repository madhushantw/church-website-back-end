import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const statusCode = request.statusCode ?? 200;

    return next.handle().pipe(
      map((data: T) => {
        const payload: Record<string, unknown> = {
          statusCode,
          message: 'Success',
        };

        if (Array.isArray(data)) {
          payload.total = data.length;
          payload.data = data;
          return payload;
        }

        payload.data = data;
        return payload;
      }),
    );
  }
}
