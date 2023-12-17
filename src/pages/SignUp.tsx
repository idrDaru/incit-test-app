import {
  Box,
  Button,
  Card,
  FormControl,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Cookies } from "react-cookie";
import { Link, Navigate, useNavigate } from "react-router-dom";
import passwordHelperText from "../components/passwordHelperText";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";

export default function SignUp() {
  const [value, setValue] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showHint, setShowHint] = useState(false);

  const [wrongEmail, setWrongEmail] = useState(false);
  const [emailLabel, setEmailLabel] = useState("Email");
  const [wrongPassword, setWrongPassword] = useState(false);
  const [passwordLabel, setPasswordLabel] = useState("Password");
  const [wrongConfirmPassword, setWrongConfirmPassword] = useState(false);
  const [confirmPasswordLabel, setConfirmPasswordLabel] =
    useState("Confirm Password");
  const [serverError, setServerError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (
      value.email &&
      value.password &&
      value.confirmPassword &&
      value.password === value.confirmPassword &&
      validatePassword()
    ) {
      const body = {
        email: value.email,
        password: value.password,
      };
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/user/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (response.status === 201) {
        navigate("/");
      } else if (response.status === 409) {
        setWrongEmail(true);
        setEmailLabel("Email already exists");
      } else {
        setServerError(true);
      }
    } else if (!value.email) {
      setWrongEmail(true);
      setEmailLabel("Required");
    } else if (!value.password) {
      setWrongPassword(true);
      setPasswordLabel("Required");
    } else if (!value.confirmPassword) {
      setWrongConfirmPassword(true);
      setConfirmPasswordLabel("Required");
    } else if (value.password !== value.confirmPassword) {
      setWrongConfirmPassword(true);
      setConfirmPasswordLabel("Not match");
    }
  };

  const handleChange = (key: string, newValue: string) => {
    if (key === "email") {
      setWrongEmail(false);
      setEmailLabel("Email");
    } else if (key === "password") {
      setWrongPassword(false);
      setPasswordLabel("Password");
    } else if (key === "confirmPassword") {
      setWrongConfirmPassword(false);
      setConfirmPasswordLabel("Confirm Password");
    }
    setValue({ ...value, ...{ [key]: newValue } });
  };

  const validatePassword = (): boolean => {
    return true;
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
            overflow: "auto",
            scrollbarWidth: "none",
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Typography variant="h3">Sign Up</Typography>
          <FormControl
            sx={{
              display: "flex",
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
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
              }}
            >
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
              <IconButton
                sx={{
                  borderRadius: 0,
                  justifyContent: "center",
                  p: 0,
                }}
                onClick={() => {
                  setShowHint(!showHint);
                }}
                disableRipple
              >
                {showHint ? <CloseIcon /> : <HelpOutlineIcon />}
              </IconButton>
              {passwordHelperText(value.password, showHint)}
            </Box>
            <TextField
              id="outlined-basic"
              variant="outlined"
              autoComplete="off"
              label={confirmPasswordLabel}
              error={wrongConfirmPassword}
              value={value.confirmPassword}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleChange("confirmPassword", event.target.value);
              }}
            />
            <Button variant="contained" onClick={handleSubmit}>
              Sign Up
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
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Link
                to="/signin"
                style={{ textDecoration: "none", color: "blue" }}
              >
                Sign In
              </Link>
            </Typography>
          </FormControl>
        </Box>
      </Card>
    </Box>
  );
}
