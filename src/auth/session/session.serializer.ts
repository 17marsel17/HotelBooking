import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  deserializeUser(payload: any, done: Function): any {
    done(null, payload);
  }

  serializeUser(user: any, done: Function): any {
    done(null, user);
  }
}
