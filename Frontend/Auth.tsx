import React, { useState } from "react";
import AuthApi from "./api/auth";

import {
  storeAccessToken,
  storeAccessTokenExpiryTime,
  storeRefreshToken,
} from "./clientUtils";
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
    return AuthApi.login(username, password).then(
      ({ status, data }: { status: number; data: any }) => {
        if (status === 200) {
          setIsAuthenticated(true);
          const { accessToken, refreshToken, expiresAt } = data;

          expiresAt && storeAccessTokenExpiryTime(expiresAt);
          accessToken && storeAccessToken(accessToken);
          refreshToken && storeRefreshToken(refreshToken);

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
