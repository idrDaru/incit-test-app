import {
  Box,
  Button,
  Card,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Cookies } from "react-cookie";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [value, setValue] = useState({
    email: "",
    password: "",
  });

  const [wrongEmail, setWrongEmail] = useState(false);
  const [emailLabel, setEmailLabel] = useState("Email");
  const [wrongPassword, setWrongPassword] = useState(false);
  const [passwordLabel, setPasswordLabel] = useState("Password");

  const [serverError, setServerError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (value.email && value.password) {
      const body = {
        email: value.email,
        password: value.password,
      };
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (response.status === 200) {
        const responseBody = await response.json();
        const { access_token } = responseBody;
        const cookies = new Cookies(null, { path: "/" });
        cookies.set("access_token", access_token, { path: "/" });
        navigate("/");
      } else if (response.status === 401) {
        setWrongPassword(true);
        setPasswordLabel("Wrong Password");
      } else if (response.status === 404) {
        setWrongEmail(true);
        setEmailLabel("Email Not Registered Yet");
      } else {
        setServerError(true);
      }
    } else if (!value.email) {
      setWrongEmail(true);
      setEmailLabel("Required");
    } else if (!value.password) {
      setWrongPassword(true);
      setPasswordLabel("Required");
    }
  };

  const handleChange = (key: string, newValue: string) => {
    if (key === "email") {
      setWrongEmail(false);
      setEmailLabel("Email");
    } else if (key === "password") {
      setWrongPassword(false);
      setPasswordLabel("Password");
    }
    setValue({ ...value, ...{ [key]: newValue } });
  };

  const cookies = new Cookies(null, { path: "/" });
  if (cookies.get("access_token")) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        height: "100vh",
        width: "100vw",
        boxSizing: "border-box",
      }}
    >
      <Card
        sx={{
          p: 7,
          width: "40%",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1vw",
            alignItems: "center",
          }}
        >
          <Typography variant="h3">Sign In</Typography>
          <FormControl
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {serverError ? (
              <Typography variant="body2" color={"red"}>
                Server error! Try again later.
              </Typography>
            ) : null}
            <TextField
              id="outlined-basic"
              variant="outlined"
              label={emailLabel}
              error={wrongEmail}
              value={value.email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleChange("email", event.target.value);
              }}
              sx={{ width: "100%" }}
            />
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              label={passwordLabel}
              error={wrongPassword}
              value={value.password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleChange("password", event.target.value);
              }}
              sx={{ width: "100%" }}
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ width: "100%" }}
            >
              Sign In
            </Button>

            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                gap: "8%",
              }}
            >
              <Button variant="text" sx={{ p: 0 }}>
                <img
                  width="48"
                  height="48"
                  src="https://img.icons8.com/fluency/48/google-logo.png"
                  alt="google-logo"
                />
              </Button>
              <Button variant="text" sx={{ p: 0 }}>
                <img
                  width="48"
                  height="48"
                  src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/48/external-online-social-media-facebook-website-homescreen-logo-button-logo-color-tal-revivo.png"
                  alt="external-online-social-media-facebook-website-homescreen-logo-button-logo-color-tal-revivo"
                />
              </Button>
            </Box>
            <Typography>
              Don't have account?{" "}
              <Link
                to="/signup"
                style={{ textDecoration: "none", color: "blue" }}
              >
                Sign Up
              </Link>
            </Typography>
          </FormControl>
        </Box>
      </Card>
    </Box>
  );
}
