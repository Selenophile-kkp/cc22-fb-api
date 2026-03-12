import createHttpError from "http-errors";
import identityKeyCheck from "../utils/identity.util.js";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { registerSchema } from "../validations/schema.js";

export async function register(req, res, next) {
  // validation
  const data = await registerSchema.parseAsync(req.body);

  //check identity is email or mobile
  const identityKey = data.email ? "email" : "mobile";

  // find user for non-duplicate
  const foundUser = await prisma.user.findUnique({
    where: { [identityKey]: data[identityKey] },
  });
  if (foundUser) {
    return next(createHttpError[409]("This user already register"));
  }

  const createedUser = await prisma.user.create({ data: data });

  const userInfo = {
    id: createedUser.id,
    [identityKey]: data.identity,
    firstName: createedUser.firstName,
    lastName: createedUser.lastName,
  };

  res.json({
    message: "Register successful",
    user: userInfo,
  });
}

export async function login(req, res, next) {
  res.send("Login Controller");
}

export async function getMe(req, res, next) {
  res.send("GetMe Controller");
}
