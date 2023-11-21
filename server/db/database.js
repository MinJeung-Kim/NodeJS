import Mongoose from "mongoose";
import { config } from "../config.js";

export async function connectDB() {
  return Mongoose.connect(config.db.host);
}

export function useVirtualId(schema) {
  // schema에 _id를 가상의 id로 읽어와라. _id -> id
  schema.virtual("id").get(function () {
    return this._id.toString();
  });
  // schema에 json으로 변환할때 가상 요소도 포함해라.
  schema.set("toJSON", { virtuals: true });
  // console.log에서도 가상 요소 포함
  schema.set("toObject", { virtuals: true });
}
