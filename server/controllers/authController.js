import bcrypt from "bcryptjs";
import User from "../models/User.js";
import AuthLog from "../models/AuthLog.js";
import { createToken, setAuthCookie, clearAuthCookie } from "../utils/generateToken.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function writeAuthLog(req, details) {
  try {
    await AuthLog.create({
      ...details,
      ipAddress: req.ip || "",
      userAgent: req.get("user-agent") || ""
    });
  } catch (error) {
    console.error("Could not write authentication log:", error.message);
  }
}

function publicUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    totalPoints: user.totalPoints,
    gamesPlayed: user.gamesPlayed,
    identities: user.identities.map((identity) => identity.provider),
    createdAt: user.createdAt,
    lastLogin: user.lastLogin
  };
}

function issueSession(res, user) {
  const token = createToken(user._id);
  setAuthCookie(res, token);
}

export async function register(req, res) {
  const username = String(req.body.username || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (username.length < 3 || username.length > 24) {
    return res.status(400).json({ message: "Username must be 3–24 characters." });
  }
  if (!emailPattern.test(email)) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }
  if (password.length < 8 || password.length > 72) {
    return res.status(400).json({ message: "Password must be 8–72 characters." });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      await writeAuthLog(req, {
        email, provider: "local", action: "register",
        success: false, reason: "Email already registered"
      });
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      email,
      passwordHash,
      identities: [{ provider: "local", providerId: email }]
    });

    user.lastLogin = new Date();
    await user.save();

    await writeAuthLog(req, {
      userId: user._id, email, provider: "local",
      action: "register", success: true
    });

    issueSession(res, user);
    return res.status(201).json({
      message: "Account created successfully.",
      user: publicUser(user)
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "This email or login identity is already registered." });
    }
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Could not create your account." });
  }
}

export async function login(req, res) {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  try {
    const user = await User.findOne({ email }).select("+passwordHash");
    const valid = user?.passwordHash
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!valid) {
      await writeAuthLog(req, {
        email, provider: "local", action: "login",
        success: false, reason: "Invalid credentials"
      });
      return res.status(401).json({ message: "Invalid email or password." });
    }

    user.lastLogin = new Date();
    await user.save();

    await writeAuthLog(req, {
      userId: user._id, email, provider: "local",
      action: "login", success: true
    });

    issueSession(res, user);
    return res.json({ message: "Login successful.", user: publicUser(user) });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Could not log in." });
  }
}

export async function logout(req, res) {
  await writeAuthLog(req, {
    userId: req.user?._id || null,
    email: req.user?.email || "",
    provider: "local",
    action: "logout",
    success: true
  });
  clearAuthCookie(res);
  return res.json({ message: "Logged out successfully." });
}

export async function me(req, res) {
  return res.json({ user: publicUser(req.user) });
}

export async function socialLogin(req, res) {
  const identity = req.user;

  if (!identity?.providerId || !identity?.email) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=provider_email_missing`);
  }
  if (identity.provider === "google" && !identity.emailVerified) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=email_not_verified`);
  }

  try {
    let user = await User.findOne({
      identities: {
        $elemMatch: {
          provider: identity.provider,
          providerId: identity.providerId
        }
      }
    });

    if (!user) {
      const emailOwner = await User.findOne({ email: identity.email });

      // Never silently link a social identity to an existing account.
      // The user can sign in with their existing method; account linking can be added later.
      if (emailOwner) {
        await writeAuthLog(req, {
          email: identity.email, provider: identity.provider,
          action: "oauth_login", success: false,
          reason: "Email belongs to an existing account"
        });
        return res.redirect(`${process.env.CLIENT_URL}/login?error=account_exists`);
      }

      user = await User.create({
        username: String(identity.username || "Quiz Player").slice(0, 24),
        email: identity.email,
        avatar: identity.avatar || "",
        identities: [{
          provider: identity.provider,
          providerId: identity.providerId
        }]
      });
    }

    user.lastLogin = new Date();
    await user.save();

    await writeAuthLog(req, {
      userId: user._id,
      email: user.email,
      provider: identity.provider,
      action: "oauth_login",
      success: true
    });

    issueSession(res, user);
    return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    console.error("Social login error:", error);
    return res.redirect(`${process.env.CLIENT_URL}/login?error=social_login_failed`);
  }
}
