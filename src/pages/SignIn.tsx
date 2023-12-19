import {
  Backdrop,
  Box,
  Card,
  CircularProgress,
  Collapse,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Cookies } from "react-cookie";
import { Link, Navigate } from "react-router-dom";
import GoogleSignIn from "../components/SignIn/GoogleSignIn";
import FacebookSignIn from "../components/SignIn/FacebookSignIn";
import UserDefinedForm from "../components/SignIn/UserDefinedForm";

export default function SignIn() {
  const [message, setMessage] = useState<string | boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
          }}
        >
          <Typography variant="h3">Sign In</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
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
              <GoogleSignIn />
              <FacebookSignIn setIsLoading={setIsLoading} />
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
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
