import React from "react";

function useJwtToken() {
  const [token, setToken] = React.useState("");

  React.useEffect(() => {
    // Read the JWT token from localStorage
    // This is one is always
    const storedToken = localStorage.getItem("jwtToken");

    if (storedToken) {
      // If a token is found in localStorage, set it in the state
      setToken(storedToken);
    }
  }, []);

  return token;
}

export default useJwtToken;
