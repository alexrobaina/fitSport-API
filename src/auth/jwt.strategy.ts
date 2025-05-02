import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your_jwt_secret', // ⚠️ Use process.env.JWT_SECRET in real apps
    });
  }

  async validate(payload: any) {
    // This is the user data that will be available in request.user
    return { userId: payload.sub, email: payload.email };
  }
}
