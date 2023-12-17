import { Box, Button, Card } from "@mui/material";
import ChangePasswordCard from "../components/Dashboard/ChangePasswordCard";
import StatisticCard from "../components/Dashboard/StatisticCard";
import UserListCard from "../components/Dashboard/UserListCard";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";

interface User {
  name: string | null;
  email: string;
  isVerified: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<User>();
  const fetchUser = async () => {
    const cookies = new Cookies(null, { path: "/" });
    const token = await cookies.get("access_token");
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
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleResendEmailVerification = async () => {};

  if (!user?.isVerified)
    return (
      <Box
        sx={{
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card sx={{ p: 2 }}>
          <Button variant="contained" onClick={handleResendEmailVerification}>
            Resend Email Verification
          </Button>
        </Card>
      </Box>
    );

  return (
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
      <ChangePasswordCard />
      <UserListCard />
    </Box>
  );
}
