import FacebookLogin, {
  FailResponse,
  ProfileSuccessResponse,
  SuccessResponse,
} from "@greatsumini/react-facebook-login";
import { Box, Button } from "@mui/material";
import React from "react";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function FacebookSignIn({
  setIsLoading,
  setMessage,
}: React.SetStateAction<any>) {
  const navigate = useNavigate();
  const onSuccess = async (res: SuccessResponse) => {};

  const onFail = (err: FailResponse) => {};

  const onProfileSuccess = async (res: ProfileSuccessResponse) => {
    const { email } = res;
    const body = { email };
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/auth/login/facebook`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    setIsLoading(false);
    if (response.ok) {
      const responseBody = await response.json();
      const { access_token } = responseBody;
      const cookies = new Cookies(null, { path: "/" });
      cookies.set("access_token", access_token, { path: "/" });
      navigate("/");
    } else {
      const { message } = await response.json();
      setMessage(message);
    }
  };

  const onButtonClick = () => {
    setIsLoading(true);
  };

  return (
    <FacebookLogin
      appId={process.env.REACT_APP_FACEBOOK_APP_ID!}
      onSuccess={onSuccess}
      onFail={onFail}
      onProfileSuccess={onProfileSuccess}
      render={({ onClick, logout }) => (
        <Box onClick={onButtonClick}>
          <Button variant="text" sx={{ p: 0 }} onClick={onClick}>
            <img
              width="48"
              height="48"
              src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/48/external-online-social-media-facebook-website-homescreen-logo-button-logo-color-tal-revivo.png"
              alt="external-online-social-media-facebook-website-homescreen-logo-button-logo-color-tal-revivo"
            />
          </Button>
        </Box>
      )}
    />
  );
}
