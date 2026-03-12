import createHttpError from "http-errors";
import identityKeyCheck from "../utils/identity.util.js";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

export async function register(req, res, next) {
  const { identity, firstName, lastName, password, confirmPassword } = req.body;
  // validation
  if (
    !identity.trim() ||
    !firstName.trim() ||
    !lastName.trim() ||
    !password.trim() ||
    !confirmPassword.trim()
  ) {
    return next(createHttpError[400]("fill all inputs"));
  }
  if (confirmPassword !== password) {
    return next(createHttpError[400]("check confirm-password "));
  }
  //check identity is email or mobile
  const identityKey = identityKeyCheck(identity);
  console.log(identityKey);
  if (!identityKey) {
    return next(createHttpError[400]("identity must be email or phone number"));
  }
  // find user for non-duplicate
  const foundUser = await prisma.user.findUnique({
    where: { [identityKey]: identity },
  });
  if (foundUser) {
    return next(createHttpError[409]("This user already register"));
  }

  const newUser = {
    [identityKey]: identity,
    password: await bcrypt.hash(password, 8),
    firstName: firstName,
    lastName: lastName,
  };
  const createedUser = await prisma.user.create({ data: newUser });
  // console.log(createedUser);
  const userInfo = {
    id: createedUser.id,
    [identityKey]: identity,
    firstName: createedUser.firstName,
    lastName: createedUser.lastName,
  };
  // const userInfo2 = {};
  // userInfo2.id = createedUser.id;
  // userInfo2[identityKey] = identity;
  // userInfo2["firstName"] = createedUser.firstName;
  // userInfo2.lastName = createedUser.lastName;

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
