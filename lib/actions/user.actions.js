"use server";
import User from "../models/User";

import * as bcrypt from "bcrypt";
import {
  compileActivationTemplate,
  compilePassTemplate,
  sendMail,
} from "../mail";
import { signJwt, verifyJwt } from "../jwt";
import { connectToDB } from "../db";

export async function registerUser(user) {
  connectToDB();
  const{username, email} = user;
  const hashedPass = await bcrypt.hash(user.password, 10);
  const result = await User.create({
    username, email,
    password: hashedPass,
  });

  const jwtUserId = signJwt({
    id: result.id,
  });
  const activationUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`;

  const body = compileActivationTemplate(user.name, activationUrl);

  await sendMail({ to: user.email, subject: "Activate your account", body });
  return result;
}

export const activateUser = async (jwtUserID) => {
  connectToDB();
  const payload = verifyJwt(jwtUserID);
  const userId = payload?.id;
  const user = await User.findOne({
    id: userId,
  });

  if (!user) return "userNotExist";
  if (user.emailVerified) return "alreadyActivated";

  const result = await User.findByIdAndUpdate(userId, { emailVerified: true });
  return "success";
};

export const forgotPassword = async (email) => {
  connectToDB();
  const user = await User.findOne({
    email: email,
  });

  const jwtUserId = signJwt({
    id: user.id,
  });
  if (!user) throw new Error("User does not exist");

  const resetPassUrl = `${process.env.NEXTAUTH_URL}/auth/resetPassword/${jwtUserId}`;

  const body = compilePassTemplate(user.name, resetPassUrl);
  const result = sendMail({
    to: user.email,
    subject: "Reset your password",
    body,
  });
  return result;
};

export const resetPassword = async (jwtUserId, password) => {
  connectToDB();
  const payload = verifyJwt(jwtUserId);
  if (!payload) return "userNotExist";
  const userId = payload.id;
  const user = await User.findById(userId);
  if (!user) return "userNotExist";

  const result = await User.findByIdAndUpdate(userId, {
    password: await bcrypt.hash(password, 10),
  });
  if (result) return "success";
  else throw new Error("Something went wrong!");
};
