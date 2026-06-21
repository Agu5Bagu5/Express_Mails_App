const jwt = require("jsonwebtoken");
const userModel = require("../models/user.js");

const register = async (req, res) => {
  const { email, username, password, confPassword } = req.body;
  if (password !== confPassword)
    return res.status(400).json({ msg: "Konfirmasi password tidak sesuai" });
  try {
    const newUser = new userModel(req.body);
    await newUser.save();
    res
      .status(201)
      .json({ msg: "Register berhasil", data: { email, username } });
  } catch (error) {
    res.status(400).json({ msg: `Register gagal - ${error.message}` });
  }
};

const logIn = async (req, res) => {
  const jwtKey = process.env.JWT_SECRET;
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(400).json({ msg: "Password salah" });

  const token = jwt.sign(
    { id: user._id },
    jwtKey,
    { expiresIn: "1h" },
    (err, token) => {
      if (err) return res.status(500).json({ msg: err });
      res.cookie("token", token, { httpOnly: true });
      res.status(200).json({ msg: "Log In berhasil" });
    }
  );
};

const updateUsername = async (req, res) => {
  try {
    await userModel.updateOne(
      { _id: req.user.id },
      { username: req.body.username }
    );
    res
      .status(200)
      .json({ msg: "Username telah diubah", data: req.body.username });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updatePw = async (req, res) => {
  try {
    const { password, newPassword, confPassword } = req.body;
    const user = await userModel.findOne({ _id: req.user.id });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Password salah" });

    if (newPassword !== confPassword)
      return res.status(400).json({ msg: "Konfirmasi password tidak sesuai" });

    user.password = newPassword;
    await user.save();
    res.status(400).json({ msg: "Password telah diubah" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const logOut = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ msg: "Anda telah Log Out" });
};

module.exports = { register, logIn, updateUsername, updatePw, logOut };
