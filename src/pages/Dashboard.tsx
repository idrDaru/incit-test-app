import { Box, Button, Card, Collapse, Typography, Zoom } from "@mui/material";
import ChangePasswordCard from "../components/Dashboard/ChangePasswordCard";
import StatisticCard from "../components/Dashboard/StatisticCard";
import UserListCard from "../components/Dashboard/UserListCard";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export interface User {
  name: string | null;
  email: string;
  isVerified: boolean;
  isPasswordNull: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<User>();
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoadingSendEmail, setIsLoadingSendEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    const cookies = new Cookies(null, { path: "/" });
    const token = await cookies.get("access_token");
    setLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/user/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const userData = await response.json();
      const user: User = userData;
      setUser(user);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleResendEmailVerification = async () => {
    const cookies = new Cookies(null, { path: "/" });
    const token = await cookies.get("access_token");
    setIsLoadingSendEmail(true);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/user/resend-verification`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      setIsEmailSent(true);
      setTimeout(() => {
        setIsEmailSent(false);
      }, 5000);
    }
    setIsLoadingSendEmail(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: isEmailSent ? "20px" : 0,
            transition: "gap 0.5s",
          }}
        >
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Card>
      </Box>
    );
  }
  if (!user?.isVerified)
    return (
      <Zoom in={true}>
        <Box
          sx={{
            height: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: isEmailSent ? "20px" : 0,
              transition: "gap 0.5s",
            }}
          >
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isLoadingSendEmail}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <Collapse in={isEmailSent}>
              <Typography>
                Email sent! Please check your inbox or spam folder
              </Typography>
            </Collapse>
            <Button variant="contained" onClick={handleResendEmailVerification}>
              Resend Email Verification
            </Button>
          </Card>
        </Box>
      </Zoom>
    );

  return (
    <Zoom in={true}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "30vh 55vh",
          gridTemplateAreas: `
          "statistic statistic"
          "changePassword userList"
        `,
          gap: "20px",
          height: "100%",
          width: "100%",
          p: 2,
          boxSizing: "border-box",
        }}
      >
        <StatisticCard />
        <ChangePasswordCard isPasswordNull={user.isPasswordNull} />
        <UserListCard />
      </Box>
    </Zoom>
  );
}
