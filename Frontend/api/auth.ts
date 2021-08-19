const { apiRoutes } = require("../apiRoutes");

const HOST = process.env.HOST || "http://192.168.1.154";
const PORT = process.env.PORT || 5000;

export function login(username: string, password: string) {
  return fetch(`${HOST}:${PORT}${apiRoutes.login}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
}

export function register(username: string, password: string) {
  return fetch(`${HOST}:${PORT}${apiRoutes.register}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
}