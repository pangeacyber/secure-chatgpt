import { withAPIAuthentication } from "../../../../utils";

const apiHandler = async () => {
  return new Response(
    JSON.stringify({
      name: "John Doe",
      address: { state: "CA", zip: "92401" },
    }),
    {
      headers: { "content-type": "application/json" },
    }
  );
};

export const GET = withAPIAuthentication(apiHandler);
