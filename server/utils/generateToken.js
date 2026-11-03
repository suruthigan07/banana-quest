import jwt from "jsonwebtoken";

export function createToken(userId) {
  return jwt.sign(
    { sub: userId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

export function setAuthCookie(res, token) {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("quiz_token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/"
  });
}

export function clearAuthCookie(res) {
  res.clearCookie("quiz_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
}
