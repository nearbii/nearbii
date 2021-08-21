import React, { useState, useEffect } from "react";

import { login } from "./api/auth";
import { storeAccessToken } from "./clientUtils";

export const AuthContext = React.createContext({});

export default function Auth({ children }: any) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authLogin = (username: string, password: string) => {
    return login(username, password).then((res) => {
      setIsAuthenticated(res.ok);
      const jsn = res.json();
      jsn.then((jsn) => jsn.hasOwnProperty("token") && storeAccessToken(jsn.token));
      return jsn;
    });
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
