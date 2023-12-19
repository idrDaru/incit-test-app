import {
  Box,
  Button,
  Card,
  Collapse,
  FormControl,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Cookies } from "react-cookie";
import { Link, Navigate, useNavigate } from "react-router-dom";
import passwordHelperText from "../components/passwordHelperText";
import GoogleSignUp from "../components/SignUp/GoogleSignUp";
import FacebookSignUp from "../components/SignUp/FacebookSignUp";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import validatePassword, {
  validateConfirmPassword,
} from "../lib/validatePassword";
import UserDefinedForm from "../components/SignUp/UserDefinedForm";

export default function SignUp() {
  const [message, setMessage] = useState<string | boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <Collapse in={Boolean(message)}>
              <Typography variant="body2" color={"red"}>
                {message}
              </Typography>
            </Collapse>
            <UserDefinedForm
              message={message}
              setIsLoading={setIsLoading}
              setMessage={setMessage}
            />
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                gap: "8%",
              }}
            >
              <GoogleSignUp
                setMessage={setMessage}
                setIsLoading={setIsLoading}
              />

              <FacebookSignUp
                setMessage={setMessage}
                setIsLoading={setIsLoading}
              />
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
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
