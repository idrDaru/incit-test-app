import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function GoogleSignIn() {
  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;
    const body = { credential };
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/auth/login/google`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    if (response.ok) {
      const responseBody = await response.json();
      const { access_token } = responseBody;
      const cookies = new Cookies(null, { path: "/" });
      cookies.set("access_token", access_token, { path: "/" });
      navigate("/");
    }
  };
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID!}>
      <GoogleLogin onSuccess={handleGoogleLogin} text="signin"/>
    </GoogleOAuthProvider>
  );
}
