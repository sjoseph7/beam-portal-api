import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";
import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../api/utils/errorResponse";

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
export const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.JWT_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.JWT_AUDIENCE,
  issuer: `https://${process.env.JWT_DOMAIN}/`,
  algorithms: ["RS256"]
});

export const checkPermissions = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Reject users with invalid roles
    const intersections = req.user.permissions.filter((permission: any) =>
      roles.includes(permission)
    );
    if (intersections.length === 0) {
      return next(
        new ErrorResponse(`Not authorized to access this route`, 403)
      );
    }
    // Accept users with valid roles
    next();
  };
};
