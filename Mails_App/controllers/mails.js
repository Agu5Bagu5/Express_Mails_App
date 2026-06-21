const user = require("../models/user.js");
const userModel = require("../models/user.js");

const mailLoad = async (req, res) => {
  try {
    const { username, mails, history } = await userModel.findOne({
      _id: req.user.id,
    });

    return res.json({ username, mails, history });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

const sendMail = async (req, res) => {
  try {
    if (req.params.id === req.user.id)
      return res
        .status(401)
        .json({ msg: "Tidak dapat mengirim pesan ke diri sendiri" });

    const { username } = await userModel.findOne({ _id: req.user.id });

    const date = (() => {
      const dateNow = new Date(Date.now());
      const date = `${dateNow.getDate()}-${
        dateNow.getMonth() + 1
      }-${dateNow.getFullYear()}`;
      const time = `${dateNow.getHours()}:${dateNow.getMinutes()}`;
      return `${date}  ${time}`;
    })();

    const mail = { from: username, msg: req.body.mail, date };
    const recipient = await userModel.findByIdAndUpdate(req.params.id, {
      $push: { mails: mail },
    });

    if (!recipient)
      return res.status(404).json({ msg: "User tidak ditemukan" });

    const history = { to: recipient.username, msg: req.body.mail, date };
    await userModel.updateOne({ _id: req.user.id }, { $push: { history } });

    res.status(201).json({ msg: "Pesan terkirim", data: mail });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { mailLoad, sendMail };
