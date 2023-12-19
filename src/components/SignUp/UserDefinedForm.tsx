import {
  Box,
  Button,
  FormControl,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";
import passwordHelperText from "../passwordHelperText";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import validatePassword, {
  validateConfirmPassword,
} from "../../lib/validatePassword";

interface UserDefinedFormProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string | boolean | null>>;
  message: string | boolean | null;
}

export default function UserDefinedForm({
  setIsLoading,
  setMessage,
  message,
}: UserDefinedFormProps) {
  const [value, setValue] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showHint, setShowHint] = useState<boolean>(false);
  const [successModal, setSuccessModal] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (validateForm()) {
      const body = {
        email: value.email,
        password: value.password,
      };
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/user/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      setIsLoading(false);
      if (response.status === 201) {
        setSuccessModal(
          "Verification link has been sent to your email. Please check your inbox and spam folder. You will be redirected soon. Please wait."
        );
        setTimeout(() => {
          navigate("/");
        }, 10000);
      } else {
        const { message } = await response.json();
        setMessage(message);
      }
    }
  };

  const handleChange = (key: string, newValue: string) => {
    setMessage(null);
    setValue({ ...value, ...{ [key]: newValue } });
  };

  const validateForm = (): boolean => {
    if (!value.email || !value.password || !value.confirmPassword) {
      setMessage("Please fill in required field");
      return false;
    }

    if (!validatePassword(value.password)) {
      setMessage("Password not fulfil requirements");
      setShowHint(true);
      return false;
    }

    if (!validateConfirmPassword(value.password, value.confirmPassword)) {
      setMessage("Password not same");
      return false;
    }
    return true;
  };
  return (
    <FormControl
      sx={{
        display: "flex",
        gap: "20px",
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
      <TextField
        id="outlined-basic"
        variant="outlined"
        label="Email"
        error={Boolean(message)}
        value={value.email}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          handleChange("email", event.target.value);
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
          variant="outlined"
          autoComplete="off"
          label="Password"
          error={Boolean(message)}
          value={value.password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleChange("password", event.target.value);
          }}
          sx={{ width: "100%" }}
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
        {passwordHelperText(value.password, showHint)}
      </Box>
      <TextField
        id="outlined-basic"
        variant="outlined"
        autoComplete="off"
        label="Confirm Password"
        error={Boolean(message)}
        value={value.confirmPassword}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          handleChange("confirmPassword", event.target.value);
        }}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Sign Up
      </Button>
    </FormControl>
  );
}
