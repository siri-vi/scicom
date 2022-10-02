const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // user_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    //     phone: { type: String },
    //     notifToken: { type: String },
    //     signinProvider: { type: String },
    //     initialMode: { type: String, enum: ["ICE", "IDEA"] },
    //     verification: { type: Boolean, default: false },
    //     location: {
    //       type: {
    //         type: String,
    //         enum: ["Point"],
    //       },
    //       coordinates: {
    //         type: [Number],
    //       },
    //     },
    //     hometown: { type: String },
    //     iceOnboarding: { type: Boolean, default: false },
    //     ideaOnboarding: { type: Boolean, default: false },
    //     loggedThru: { type: String },
    //     lastLogin: { type: Date, default: Date.now() },
    //     subscriptionPlan: {
    //       type: String,
    //       enum: ["trial", "day", "week", "month", "year"],
    //       default: "trial",
    //     },
    //     planExpiry: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// userSchema.index({ location: "2dsphere" });
// const myDB = mongoose.connection.useDb("Users");

const Users = mongoose.model("Users", userSchema);
module.exports = Users;

//Todo : update this
// icognitomode
// accountCreation
// snoozemood
// dateMode
// Queries
// Notification Settings
// reminders for payments
