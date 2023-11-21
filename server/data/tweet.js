import MongoDb from "mongodb";
import { getTweets } from "../db/database.js";
import * as UserRepository from "./auth.js";
const ObjectID = MongoDb.ObjectId;

//NOSQL 정보의 중복성 > 관계: 쿼리의 성능을 위해서

export async function getAll() {
  return getTweets() //
    .find()
    .sort({ createdAt: -1 })
    .toArray()
    .then(mapTweets); // _id -> id
}

export async function getAllByUsername(username) {
  return getTweets() //
    .find({ username })
    .sort({ createdAt: -1 })
    .toArray()
    .then(mapTweets); // _id -> id
}

export async function getById(id) {
  return getTweets()
    .findOne({ _id: new ObjectID(id) })
    .then(mapOptionalTweet);
}

export async function create(text, userId) {
  const { name, username, url } = await UserRepository.findById(userId);
  const tweet = {
    text,
    createdAt: new Date(),
    userId,
    name,
    username,
    url,
  };

  return getTweets()
    .insertOne(tweet)
    .then((data) => mapOptionalTweet({ ...tweet, _id: data.insertedId }));
}

export async function update(id, text) {
  return getTweets()
    .findOneAndUpdate(
      { _id: new ObjectID(id) },
      { $set: { text } },
      { returnDocument: 'after' }
    )
    .then((result) => result.value)
    .then(mapOptionalTweet);
}

export async function remove(id) {
  return getTweets().deleteOne({ _id: new ObjectID(id) });
}

function mapOptionalTweet(tweet) {
  return tweet ? { ...tweet, id: tweet._id.toString() } : tweet;
}

function mapTweets(tweets) {
  return tweets.map(mapOptionalTweet);
}
