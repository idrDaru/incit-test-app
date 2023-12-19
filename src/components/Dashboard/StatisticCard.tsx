import {
  Box,
  Card,
  CircularProgress,
  Collapse,
  Typography,
  Zoom,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";

interface Statistic {
  userCount: number;
  todayActiveSessionCount: number;
  avgActiveSessionLast7Days: number;
}

export default function StatisticCard() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statistic, setStatistic] = useState<Statistic>();

  const fetchStatistic = async () => {
    const cookies = new Cookies(null, { path: "/" });
    const token = await cookies.get("access_token");

    setIsLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/user/statistic`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const statisticData = await response.json();
      const statistic: Statistic = statisticData;
      setStatistic(statistic);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchStatistic();
  }, []);

  return (
    <Card
      sx={{
        gridArea: "statistic",
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
      <Typography variant="h5">Statistic</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          p: 2,
        }}
      >
        <Collapse in={isLoading} unmountOnExit>
          <CircularProgress color="inherit" />
        </Collapse>

        <Zoom in={!isLoading}>
          <Card sx={{ p: 2 }}>
            <Typography>
              Total Number of Users: {statistic?.userCount} users
            </Typography>
          </Card>
        </Zoom>
        <Zoom in={!isLoading}>
          <Card sx={{ p: 2 }}>
            <Typography>
              Total number of users with active sessions today:{" "}
              {statistic?.todayActiveSessionCount} users
            </Typography>
          </Card>
        </Zoom>
        <Zoom in={!isLoading}>
          <Card sx={{ p: 2 }}>
            <Typography>
              Average number of active session users in the last 7 days rolling:{" "}
              {statistic?.avgActiveSessionLast7Days.toFixed(3)} per day
            </Typography>
          </Card>
        </Zoom>
      </Box>
    </Card>
  );
}
