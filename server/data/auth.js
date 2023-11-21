import MongoDb from "mongodb";
import { getUsers } from "../db/database.js";
const ObjectID = MongoDb.ObjectId;

// SQL: DB Schema
// NOSQL: DB Schema X, ORM Schema
export async function findByUsername(username) {
  return getUsers().find({ username }).next().then(mapOptionalUser);
}

export async function findById(id) {
  return getUsers()
    .find({ _id: new ObjectID(id) })
    .next()
    .then(mapOptionalUser);
}

export async function createUser(user) {
  return getUsers()
    .insertOne(user)
    .then((data) => data.insertedId.toString());
}

function mapOptionalUser(user) {
  return user ? { ...user, id: user._id.toString() } : user;
}
