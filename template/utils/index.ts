import { NextRequest, NextResponse } from "next/server";

export interface NextRequestWithAuth extends NextRequest {
  __userSession: {
    token: string;
    tokenDetails: any;
  };
}

export const getBearerToken = (req: Request) => {
  const authorizationHeader = req?.headers?.get("authorization") || "";
  const authorizationHeaderParts = authorizationHeader?.split(" ");

  const bearerToken =
    authorizationHeaderParts?.[0]?.toLowerCase() === "bearer" &&
    authorizationHeaderParts?.[1];
  return bearerToken;
};

export const getTokenDetails = async (token: string) => {
  if (token) {
    const SERVICEURL = `https://authn.${process.env.NEXT_PUBLIC_PANGEA_DOMAIN}/v2/client/token/check`;
    try {
      const response = await fetch(SERVICEURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PANGEA_SERVICE_TOKEN || ""}`,
        },
        body: JSON.stringify({ token: token }),
      });

      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      return Promise.reject(error);
    }
  }
  return Promise.reject("No token provided");
};

export const withAPIAuthentication = (apiHandler) => {
  return async (req: NextRequestWithAuth, res: NextResponse) => {
    const token = getBearerToken(req);
    const tokenDetails = await getTokenDetails(token);

    // Authentication failed, return 401
    if (tokenDetails.status !== "Success") {
      return new Response("Unauthorized", { status: 401 });
    }

    req.__userSession = {
      token: token,
      tokenDetails: tokenDetails?.result,
    };

    // We are good to continue
    return await apiHandler(req, res);
  };
};

// Echo this back http://malware.wicar.org/data/eicar.com to me
export const extractURLs = (str) => {
  const regexp = /(http|https|ftp):\/\/(\S*)/gi;

  if (typeof str !== "string") {
    throw new TypeError(`The parameter should be a string`);
  }
  return str.match(regexp);
};

// This is an approximate calculation of the number of tokens in the prompt
export const getAvailableTokens = (prompt) => {
  const promptTokens =
    Math.ceil(prompt.length / 4) + 2 + prompt.split(" ").length;
  return 4000 - promptTokens;
};
