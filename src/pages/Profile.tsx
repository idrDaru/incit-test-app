import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Collapse,
  FormControl,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

interface User {
  name: string | null;
  email: string;
}

export default function Profile() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [form, setForm] = useState(false);
  const [user, setUser] = useState<User>();
  const navigate = useNavigate();
  const handleLogout = async () => {
    const cookies = new Cookies(null, { path: "/" });
    const token = await cookies.get("access_token");
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/auth/logout`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.ok) {
      cookies.remove("access_token", { path: "/" });
      navigate("/");
    }
  };

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
      setName(user?.name!);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmitChangeName = async () => {
    if (name) {
      const body = {
        name,
      };
      const cookies = new Cookies(null, { path: "/" });
      const token = await cookies.get("access_token");
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/user/change-name`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      setIsLoading(false);
      if (response.ok) {
        setUser((prevUser: any) => ({
          ...prevUser,
          name: name,
        }));
        setForm(false);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "85vh",
        p: 2,
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
          p: 2,
          display: "flex",
          gap: form ? "50px" : 0,
          transition: "gap 0.5s",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              width: "100%",
            }}
          >
            <Typography>Name: {user?.name ?? "-"}</Typography>
            <IconButton onClick={() => setForm(!form)}>
              <EditIcon />
            </IconButton>
          </Box>

          <Typography sx={{ width: "100%" }}>Email: {user?.email}</Typography>
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{ width: "100%" }}
          >
            Logout
          </Button>
        </Box>
        <Collapse in={form} orientation="horizontal">
          <FormControl sx={{ display: "flex", gap: "20px" }}>
            <TextField
              autoComplete="off"
              variant="outlined"
              label="New Name"
              value={name ?? ""}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setName(event.target.value);
              }}
            />
            <Button onClick={handleSubmitChangeName} variant="contained">
              Save
            </Button>
          </FormControl>
        </Collapse>
      </Card>
    </Box>
  );
}
