import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  if (!token) return next(createHttpError(401, "You are unathourized"));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createHttpError(403, "invalid token"));
    req.user = user;
    next();
  });
};
