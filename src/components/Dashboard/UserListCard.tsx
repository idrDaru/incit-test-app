import { Box, Card, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";

interface User {
  signUpDate: string;
  name: string | null;
  session: {
    loginCount: number;
    latestLogoutDate: string | null;
    currentActiveSessionCount: number;
  };
}

export default function UserListCard() {
  const [userList, setUserList] = useState<User[]>([]);

  const parseDate = (isoDate: Date) => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    return date.toLocaleString();
  };

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const cookies = new Cookies(null, { path: "/" });
        const token = await cookies.get("access_token");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/user/list`,
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
          const users: User[] = userData.map((element: any) => ({
            signUpDate: parseDate(element.signUpDate),
            name: element.name,
            session: {
              loginCount: element.session.loginCount,
              latestLogoutDate: parseDate(element.session.latestLogoutDate),
              currentActiveSessionCount:
                element.session.currentActiveSessionCount,
            },
          }));
          setUserList(users);
        } else {
          // Handle HTTP error
        }
      } catch (error) {
        // Handle fetch or other errors
      }
    };

    fetchUserList();
  }, []);

  return (
    <Card
      sx={{
        gridArea: "userList",
        display: "grid",
        gridTemplateRows: "40px 1fr",
        p: 2,
        overflow: "auto",
        scrollbarWidth: "none",
        "::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Typography variant="h5">User List</Typography>
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {userList.map((value, index) => (
          <Card key={index} sx={{ p: 2 }}>
            <Typography>
              Name: {value.name === null ? "-" : value.name}
            </Typography>
            <Typography>Registered at: {value.signUpDate}</Typography>
            <Typography>Number of login: {value.session.loginCount}</Typography>
            <Typography>
              Number of current active session:{" "}
              {value.session.currentActiveSessionCount}
            </Typography>
            <Typography>
              Latest logout date: {value.session.latestLogoutDate}
            </Typography>
          </Card>
        ))}
      </Box>
    </Card>
  );
}
