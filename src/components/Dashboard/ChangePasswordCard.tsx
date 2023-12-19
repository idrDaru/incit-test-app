import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Collapse,
  FormControl,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import passwordHelperText from "../passwordHelperText";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";
import { Cookies } from "react-cookie";
import validatePassword, {
  validateConfirmPassword,
} from "../../lib/validatePassword";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordCard({ isPasswordNull }: any) {
  const navigate = useNavigate();
  const [successModal, setSuccessModal] = useState<string | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  const [value, setValue] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (key: string, newValue: string): void => {
    setMessage(null);
    setValue({ ...value, ...{ [key]: newValue } });
  };

  const handleChangePassword = async (): Promise<void> => {
    if (validateForm()) {
      const cookies = new Cookies(null, { path: "/" });
      const token = await cookies.get("access_token");

      const body = {
        oldPassword: value.oldPassword,
        newPassword: value.newPassword,
      };
      setIsLoading(true);
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
      setIsLoading(false);
      if (response.ok) {
        setSuccessModal("Password Successfully Changed. Closing Soon...");
        setTimeout(() => {
          setSuccessModal(null);
          navigate("/");
        }, 3000);
      } else {
        const { message } = await response.json();
        setMessage(message);
      }
    }
  };

  const validateForm = (): boolean => {
    if (!isPasswordNull && !value.oldPassword) {
      setMessage("Please fill in required field");
      return false;
    }

    if (!value.newPassword || !value.confirmPassword) {
      setMessage("Please fill in required field");
      return false;
    }

    if (!validatePassword(value.newPassword)) {
      setMessage("Password not fulfil requirements");
      setShowHint(true);
      return false;
    }

    if (!validateConfirmPassword(value.newPassword, value.confirmPassword)) {
      setMessage("Password not same");
      return false;
    }

    return true;
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
      <Modal
        open={Boolean(successModal)}
        onClose={() => setSuccessModal(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 5,
          }}
        >
          <Typography id="modal-modal-description" sx={{ color: "black" }}>
            {successModal}
          </Typography>
        </Box>
      </Modal>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
          <Collapse in={Boolean(message)}>
            <Typography variant="body2" color={"red"}>
              {message}
            </Typography>
          </Collapse>

          {isPasswordNull ? null : (
            <TextField
              id="outlined-basic"
              autoComplete="off"
              variant="outlined"
              label="Old Password"
              error={Boolean(message)}
              value={value.oldPassword}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleChange("oldPassword", event.target.value);
              }}
            />
          )}

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
              label="New Password"
              error={Boolean(message)}
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
            label="Re-enter New Password"
            error={Boolean(message)}
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
