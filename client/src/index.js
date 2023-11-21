import React from "react";
import ReactDOM from "react-dom/client";
import AuthService from "./service/auth";
import TweetService from "./service/tweet";
import { AuthProvider } from "./context/AuthContext";
import { AuthErrorEventBus } from "./context/AuthContext";
import HttpClient from "./network/http";
import Socket from "./network/socket";
import TokenStorage from "./db/token";
import App from "./App";
import "./index.css";

const baseURL = process.env.REACT_APP_BASE_URL;
const tokenStorage = new TokenStorage();
// AuthErrorEventBus : 토큰이 만료되었을 경우 login페이지로 이동하는 class
const authErrorEventBus = new AuthErrorEventBus();
const httpClient = new HttpClient(baseURL, authErrorEventBus);
const authService = new AuthService(httpClient, tokenStorage);
const socketClient = new Socket(baseURL, () => tokenStorage.getToken());
const tweetService = new TweetService(httpClient, tokenStorage, socketClient);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider
      authService={authService}
      authErrorEventBus={authErrorEventBus}
    >
      <App tweetService={tweetService} />
    </AuthProvider>
  </React.StrictMode>
);
