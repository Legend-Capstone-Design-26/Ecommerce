const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("../../mysql/index.js");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();

const createAccessToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    }
  );

const setAuthCookie = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 1000 * 60 * 60,
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
};

router.post("/signup", async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured",
      });
    }

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "email, password, name are required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const trimmedName = String(name).trim();
    const normalizedPhone = phone ? String(phone).trim() : null;

    const existingUsers = await mysql.query("userFindByEmail", normalizedEmail);

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const insertResult = await mysql.query("userCreate", {
      email: normalizedEmail,
      password_hash: passwordHash,
      name: trimmedName,
      phone: normalizedPhone,
    });

    const [createdUser] = await mysql.query("userFindById", insertResult.insertId);
    const accessToken = createAccessToken(createdUser);

    setAuthCookie(res, accessToken);

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: createdUser,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Signup failed",
      error: error.error?.message || error.message || "Unknown server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured",
      });
    }

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const [user] = await mysql.query("userFindByEmail", normalizedEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      String(password),
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const [safeUser] = await mysql.query("userFindById", user.id);
    const accessToken = createAccessToken(safeUser);

    setAuthCookie(res, accessToken);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: safeUser,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.error?.message || error.message || "Unknown server error",
    });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const [user] = await mysql.query("userFindById", req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Authorized my-page access",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load my-page data",
      error: error.error?.message || error.message || "Unknown server error",
    });
  }
});

router.post("/logout", (req, res) => {
  clearAuthCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

module.exports = router;
