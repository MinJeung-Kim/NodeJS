import Mongoose from "mongoose";
import { useVirtualId } from "../db/database.js";

// ODM에서는 Schema 작성가능
const userSchema = new Mongoose.Schema({
  username: { type: String, require: true },
  name: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  url: String,
});

// _id -> id
useVirtualId(userSchema);
const User = Mongoose.model("User", userSchema);

export async function findByUsername(username) {
  return User.findOne({ username });
}

export async function findById(id) {
  return User.findById(id);
}

export async function createUser(user) {
  return new User(user).save().then((data) => data.id);
}
