import { Button, FormControl, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [value, setValue] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    if (validateForm()) {
      const body = {
        email: value.email,
        password: value.password,
      };
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      setIsLoading(false);
      if (response.status === 200) {
        const responseBody = await response.json();
        const { access_token } = responseBody;
        const cookies = new Cookies(null, { path: "/" });
        cookies.set("access_token", access_token, { path: "/" });
        navigate("/");
      } else {
        const { message } = await response.json();
        setMessage(message);
      }
    }
  };

  const validateForm = (): boolean => {
    if (!value.email || !value.password) {
      setMessage("Please fill in required field");
      return false;
    }
    return true;
  };

  const handleChange = (key: string, newValue: string) => {
    setMessage(null);
    setValue({ ...value, ...{ [key]: newValue } });
  };

  return (
    <FormControl
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <TextField
        id="outlined-basic"
        variant="outlined"
        label="Email"
        error={Boolean(message)}
        value={value.email}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          handleChange("email", event.target.value);
        }}
        sx={{ width: "100%" }}
      />
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
      <Button variant="contained" onClick={handleSubmit} sx={{ width: "100%" }}>
        Sign In
      </Button>
    </FormControl>
  );
}
