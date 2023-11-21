import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {} from "express-async-errors";
import * as userRepository from "../data/auth.js";
import { config } from "../config.js";

export async function signup(req, res) {
  const { username, password, name, email, url } = req.body;
  // 가입하려는 username이 db에 있는지 확인.
  const found = await userRepository.findByUsername(username);
  if (found) {
    // 이미 가입 했다면 error message
    return res.status(409).json({ message: `${username} already exists` });
  }
  // 존재하지 않는다면 해싱
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  //   사용자에게 입력받은 정보를 userRepository에 전달
  // userRepository에서는 고유한 userId를 return
  const userId = await userRepository.createUser({
    username,
    password: hashed,
    name,
    email,
    url,
  });
  //   고유한 userId로 토큰 생성
  const token = createJwtToken(userId);
  res.status(201).json({ token, username });
}

export async function login(req, res) {
  const { username, password } = req.body;
  const user = await userRepository.findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: "Invalid user or password" });
  }
  //   bcrypt.compare(password, user.password) :  해싱된 pw와 사용자가 입력한 pw 비교
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid user or password" });
  }
  const token = createJwtToken(user.id);
  res.status(200).json({ token, username });
}

function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

export async function me(req, res) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ token: req.token, username: user.username });
}
