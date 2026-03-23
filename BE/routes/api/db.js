const express = require("express");
const mysql = require("../../mysql/index.js");

const router = express.Router();

router.get("/ping", async (req, res) => {
  try {
    const [result] = await mysql.query("dbConnectionCheck");

    res.status(200).json({
      success: true,
      message: "MySQL connection successful",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "MySQL connection failed",
      error: error.error?.message || "Unknown database error",
    });
  }
});

module.exports = router;
