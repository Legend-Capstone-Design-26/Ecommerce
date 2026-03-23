const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("../../mysql/index.js");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();

const normalizeUsername = (value) => String(value).trim().toLowerCase();

const createAccessToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      username: user.username,
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
    const { username, email, password, name, phone } = req.body;

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured",
      });
    }

    if (!username || !email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "username, email, password, name are required",
      });
    }

    const normalizedUsername = normalizeUsername(username);
    const normalizedEmail = String(email).trim().toLowerCase();
    const trimmedName = String(name).trim();
    const normalizedPhone = phone ? String(phone).trim() : null;

    if (!/^[a-z0-9]{4,16}$/.test(normalizedUsername)) {
      return res.status(400).json({
        success: false,
        message:
          "아이디는 영문 소문자와 숫자만 사용 가능하며 4~16자여야 합니다.",
      });
    }

    const existingByUsername = await mysql.query(
      "userFindByUsername",
      normalizedUsername
    );

    if (existingByUsername.length > 0) {
      return res.status(409).json({
        success: false,
        message: "이미 사용 중인 아이디입니다.",
      });
    }

    const existingUsers = await mysql.query("userFindByEmail", normalizedEmail);

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "이미 사용 중인 이메일입니다.",
      });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const insertResult = await mysql.query("userCreate", {
      username: normalizedUsername,
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
    const { username, password } = req.body;

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured",
      });
    }

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "아이디와 비밀번호를 입력해주세요.",
      });
    }

    const normalizedUsername = normalizeUsername(username);
    const [user] = await mysql.query("userFindByUsername", normalizedUsername);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "아이디 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      String(password),
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "아이디 또는 비밀번호가 올바르지 않습니다.",
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
