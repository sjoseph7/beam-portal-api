import expressJwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../api/utils/errorResponse";

import { promisify } from "util";
import * as jwt from "jsonwebtoken";

const client = jwksRsa({
  jwksUri: `${process.env.JWT_ISSUER}/.well-known/jwks.json`
});
const getPubKey = promisify(client.getSigningKey);

const AUTH0_JWT_OPTIONS = {
  audience: `${process.env.JWT_AUDIENCE}/`,
  issuer: `${process.env.JWT_ISSUER}/`
};

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
export const _checkJwt = expressJwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.JWT_ISSUER}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  ...AUTH0_JWT_OPTIONS,
  algorithms: ["RS256"]
});

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const middleware = expressJwt({
    // Dynamically provide a signing key
    // based on the kid in the header and
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${process.env.JWT_ISSUER}/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    ...AUTH0_JWT_OPTIONS,
    algorithms: ["RS256"]
  });

  const _next: NextFunction = (...errors: any[]) => {
    if (errors.length === 0) {
      next();
    } else {
      res.status(401).json({
        success: false,
        error: errors[0].message
      });
    }
  };

  try {
    middleware(req, res, _next);
  } catch (err) {}
};

export const checkPermissions = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Get user role
    const token = req.headers.authorization?.split(" ")[1] || "";
    const user = await getUser(token);

    // Reject users with invalid permissions
    if (!roles.includes(user.role)) {
      return next(
        new ErrorResponse(`Not authorized to access this route`, 403)
      );
    }
    // Accept users with valid role
    next();
  };
};

type Identity = Record<string, string> & {
  "https://beammath.net/sites": string[];
};

export async function getUser(token: string) {
  // @ts-ignore
  const header = jwt.decode(token, { complete: true }).header;
  const key = (await getPubKey(header.kid)).getPublicKey();

  const identity = jwt.verify(token, key, AUTH0_JWT_OPTIONS) as Identity;

  const {
    "https://beammath.net/username": username,
    "https://beammath.net/role": role,
    "https://beammath.net/sites": sites = [],
    email,
    given_name,
    family_name,
    name,
    nickname
  } = identity;

  return {
    username,
    email,
    given_name,
    family_name,
    name,
    nickname,
    role,
    sites
  };
}
