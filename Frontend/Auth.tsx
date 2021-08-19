import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { register, login } from "./api/auth";

export const AuthContext = React.createContext({});

export default function Auth({ children }: any) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");

  const authLogin = (username: string, password: string) => {
    return login(username, password).then((res) => {
      setIsAuthenticated(res.ok);
      const jsn = res.json();
      jsn.then((jsn) => jsn.hasOwnProperty("token") && setToken(jsn.token));
      return jsn;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        authLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

Auth.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
};
