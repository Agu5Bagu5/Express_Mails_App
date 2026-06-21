const mongoose = require("mongoose");
const brypt = require("bcrypt");

const schema = mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  mails: [
    {
      from: { type: String, required: true },
      msg: { type: String, required: true },
      date: { type: String, required: true },
    },
  ],
  history: [
    {
      to: { type: String, required: true },
      msg: { type: String, required: true },
      date: { type: String, required: true },
    },
  ],
});

schema.index({ mails: 1 });
schema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await brypt.genSalt(10);
    this.password = await brypt.hash(this.password, salt);
  }
  next();
});

schema.methods.comparePassword = async function (password) {
  return await brypt.compare(password, this.password);
};

module.exports = mongoose.model("Users", schema);
