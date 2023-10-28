import { PassportStatic } from "passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { User } from "./entity/User";
import { AppDataSource } from "./data-source";

export default (passport: PassportStatic, secret: string) => {
  passport.use(
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret,
      },

      // TODO: add type here
      async (jwtPayload: any, done: VerifiedCallback) => {
        try {
          const user = await AppDataSource.getRepository(User).findOneBy({
            id: jwtPayload.id,
          });

          // if user is found, pass the user to the next middleware
          if (user) {
            return done(null, user);
          }

          // otherwise, return false

          return done(null, false);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};
