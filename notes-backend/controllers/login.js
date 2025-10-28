const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  // searching for the user
  const user = await User.findOne({ username });
  // checking the password, also attached to the request
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  // if the user is not found, or the password is incorrect
  if (!(user && passwordCorrect)) {
    // 401 unauthorized
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  // The token contains the username and the user id
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  // a token is created with the method jwt.sign()
  const token = jwt.sign(userForToken, process.env.SECRET);

  // a successful request
  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
