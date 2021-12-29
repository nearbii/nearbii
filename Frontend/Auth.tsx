import React, { useState } from "react";
import AuthAPI from "./api/auth";
import TokenAPI from "./api/tokens";
import { IauthLoginResp } from "./Pages/Login";

export const AuthContext = React.createContext({});

interface IPropsAuth {
  children: any;
}

export default function Auth({ children }: IPropsAuth) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const authLogin = (
    username: string,
    password: string
  ): Promise<IauthLoginResp> => {
    return AuthAPI.login(username, password).then(
      ({ status, data }: { status: number; data: any }) => {
        if (status === 200) {
          setIsAuthenticated(true);
          const { accessToken, refreshToken, expiresAt } = data;

          expiresAt && TokenAPI.storeAccessTokenExpiryTime(expiresAt);
          accessToken && TokenAPI.storeAccessToken(accessToken);
          refreshToken && TokenAPI.storeRefreshToken(refreshToken);

          return data;
        }
      }
    );
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
