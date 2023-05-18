import { NextApiResponse, NextApiRequest } from "next";

export async function GET(request: Request) {
  return new Response("Not Found", {
    headers: { "content-type": "application/json" },
    status: 404,
  });
}
