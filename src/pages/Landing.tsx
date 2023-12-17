import { Box, Button, Card, Typography } from "@mui/material";
import { Cookies } from "react-cookie";
import { Navigate, useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
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
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
          height: "50%",
          width: "40%",
        }}
      >
        <Typography variant="h5">Landing Page</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "50px",
          }}
        >
          <Button variant="contained" onClick={() => navigate("/signin")}>
            Sign In
          </Button>
          <Button variant="contained" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
