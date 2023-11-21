import dotenv from "dotenv";
dotenv.config();

// 환경변수 설정을 안했을 경우 초기에 알 수 있는 함수.
function required(key, defaultValue = undefined) {
  // key가 있으면 key를 쓰고 defaultValue가 undefined가 아니면 defaultValue사용.
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`key ${key} is undefined`);
  }
  return value;
}

export const config = {
  jwt: {
    secretKey: required("JWT_SECRET"),
    expiresInSec: parseInt(required("JWT_EXPIRES_SEC", 86400)),
  },
  bcrypt: {
    saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS", 12)),
  },
  host: {
    port: parseInt(required("HOST_PORT", 8080)),
  },
  db:{
    host: required('DB_HOST'),
    user: required('DB_USER'),
    database: required('DB_DATABASE'),
    password: required('DB_PASSWORD'),
  }
};
