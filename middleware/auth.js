const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No Token - Authorization denied" });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res
        .status(401)
        .json({ msg: "Cannot verify - Authorization denied" });
    }
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ msg: error });
  }
};
