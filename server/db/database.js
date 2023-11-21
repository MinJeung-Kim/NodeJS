import { config } from "../config.js";
import SQ from "sequelize";

const { host, user, database, password } = config.db;
export const sequelize = new SQ.Sequelize(database, user, password, {
  host,
  dialect: "mysql", // 사용가능한 데이터베이스 명시. default = mysql
  logging: false, // db 실행 log disabled
});
