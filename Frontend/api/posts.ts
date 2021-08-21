import { readAccessToken } from "../clientUtils";

const { apiRoutes } = require("../apiRoutes");

const HOST = process.env.HOST || "http://192.168.1.2";
const PORT = process.env.PORT || 5000;

export async function createPost(postText: string) {
  return fetch(`${HOST}:${PORT}${apiRoutes.post}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await readAccessToken()}`,
    },
    body: JSON.stringify({
      text: postText,
    }),
  });
}
