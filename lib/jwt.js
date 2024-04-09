import jwt from "jsonwebtoken";

const DEFAULT_SIGN_OPTION = {
  expiresIn: "1d",
};

export function signJwt(payload, option = DEFAULT_SIGN_OPTION) {
  const secretKey = process.env.JWT_USER_ID_SECRET;
  const token = jwt.sign(payload, secretKey, { expiresIn: option.expiresIn });
  return token;
}

export function verifyJwt(token) {
  try {
    const secretKey = process.env.JWT_USER_ID_SECRET;
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (e) {
    console.log(e);
    return null;
  }
}