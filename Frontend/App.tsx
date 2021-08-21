import React from "react";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Auth from "./Auth";
const { routes } = require("./routes");
import { NativeRouter, Redirect, Route } from "react-router-native";
import Test from "./Pages/Test";

export default function App() {
  return (
    <NativeRouter>
      <Auth>
        <Route exact path={routes.register} component={Register} />
        <Route exact path={routes.login} component={Login} />
        <Route exact path="/test" component={Test} />
      </Auth>
    </NativeRouter>
  );
}
