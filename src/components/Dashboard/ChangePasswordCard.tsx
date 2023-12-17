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
import { useEffect, useState } from "react";
import passwordHelperText, {
  validatePassword,
  validateConfirmPassword,
} from "../passwordHelperText";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";
import { Cookies } from "react-cookie";

export default function ChangePasswordCard() {
  const [showHint, setShowHint] = useState(false);

  const [value, setValue] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formLabel, setFormLabel] = useState({
    oldPassword: "Old Password",
    newPassword: "New Password",
    confirmPassword: "Re-enter New Password",
  });

  const [formError, setFormError] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [globalMessage, setGlobalMessage] = useState({
    message: "",
    type: "",
  });

  const handleChange = (key: string, newValue: string): void => {
    setValue({ ...value, ...{ [key]: newValue } });
  };

  useEffect(() => {
    if (value.confirmPassword) {
      if (!validateConfirmPassword(value.newPassword, value.confirmPassword)) {
        setFormError({ ...formError, ...{ ["confirmPassword"]: true } });
      } else {
        setFormError({ ...formError, ...{ ["confirmPassword"]: false } });
      }
    }
  }, [value.confirmPassword]);

  useEffect(() => {
    if (value.newPassword) {
      if (!validatePassword(value.newPassword)) {
        setFormError({ ...formError, ...{ ["newPassword"]: true } });
      } else {
        setFormError({ ...formError, ...{ ["newPassword"]: false } });
      }
    }
  }, [value.newPassword]);

  const handleChangePassword = async (): Promise<void> => {
    if (
      value.newPassword &&
      value.oldPassword &&
      value.confirmPassword &&
      validatePassword(value.newPassword) &&
      validateConfirmPassword(value.newPassword, value.confirmPassword)
    ) {
      const cookies = new Cookies(null, { path: "/" });
      const token = await cookies.get("access_token");

      const body = {
        oldPassword: value.oldPassword,
        newPassword: value.newPassword,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/user/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (response.status === 200) {
        setValue({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setFormError({
          oldPassword: false,
          newPassword: false,
          confirmPassword: false,
        });
        setFormLabel({
          oldPassword: "Old Password",
          newPassword: "New Password",
          confirmPassword: "Re-enter New Password",
        });
        setGlobalMessage({ message: "Success", type: "success" });
      } else if (response.status === 401) {
        setFormError({ ...formError, ...{ ["oldPassword"]: true } });
        setFormLabel({
          ...formLabel,
          ...{ ["oldPassword"]: "Wrong Password" },
        });
      } else {
        setGlobalMessage({
          message: "Internal Server Error! Please try again later.",
          type: "error",
        });
      }
    }
  };

  return (
    <Card
      sx={{
        gridArea: "changePassword",
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
      <Typography variant="h5">Change Password</Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <FormControl sx={{ display: "flex", gap: "20px" }}>
          {globalMessage && globalMessage.message ? (
            <Collapse in={Boolean(globalMessage)}>
              <Typography
                color={globalMessage.type === "success" ? "green" : "red"}
                variant="body2"
              >
                {globalMessage.message}
              </Typography>
            </Collapse>
          ) : null}

          <TextField
            id="outlined-basic"
            autoComplete="off"
            variant="outlined"
            label={formLabel.oldPassword}
            error={formError.oldPassword}
            value={value.oldPassword}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleChange("oldPassword", event.target.value);
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
              autoComplete="off"
              variant="outlined"
              label={formLabel.newPassword}
              error={formError.newPassword}
              value={value.newPassword}
              sx={{ width: "100%" }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleChange("newPassword", event.target.value);
              }}
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
            {passwordHelperText(value.newPassword, showHint)}
          </Box>
          <TextField
            id="outlined-basic"
            autoComplete="off"
            label={formLabel.confirmPassword}
            error={formError.confirmPassword}
            variant="outlined"
            value={value.confirmPassword}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleChange("confirmPassword", event.target.value);
            }}
          />
          <Button variant="contained" onClick={handleChangePassword}>
            Change Password
          </Button>
        </FormControl>
      </Box>
    </Card>
  );
}
