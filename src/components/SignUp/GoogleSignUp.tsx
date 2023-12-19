import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleSignUp({
  setMessage,
  setIsLoading,
}: React.SetStateAction<any>) {
  const navigate = useNavigate();

  const onSuccess = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;
    const body = {
      credential,
    };

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/user/add/by-google`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    setIsLoading(false);

    if (response.status === 201) {
      navigate("/");
    } else {
      const { message } = await response.json();
      setMessage(message);
    }
  };

  const onError = () => {
    setMessage("Internal Server Error");
  };

  const clickListener = () => {
    setIsLoading(true);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID!}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        click_listener={clickListener}
        text="signup_with"
      />
    </GoogleOAuthProvider>
  );
}
