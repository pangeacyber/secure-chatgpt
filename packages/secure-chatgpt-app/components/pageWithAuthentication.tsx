import { useAuth } from "@pangeacyber/react-auth";
import { useRouter } from "next/router";
import { useEffect } from "react";

const pageWithAuthentication = (Component) => {
  const AuthenticatedComponent = () => {
    const { authenticated, login } = useAuth();

    useEffect(() => {
      if (!authenticated) {
        login();
      }
    }, [authenticated]);

    return !!authenticated ? <Component /> : null;
  };

  return AuthenticatedComponent;
};

export default pageWithAuthentication;
