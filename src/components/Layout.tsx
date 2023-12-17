import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { Cookies } from "react-cookie";
import { Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const cookies = new Cookies(null, { path: "/" });

  const navigate = useNavigate();

  return (
    <>
      {cookies.get("access_token") ? (
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Profile">
                  <IconButton
                    onClick={() => {
                      navigate("/profile");
                    }}
                    sx={{ p: 0 }}
                  >
                    <Avatar alt="A" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      ) : null}
      <Outlet />
    </>
  );
}
