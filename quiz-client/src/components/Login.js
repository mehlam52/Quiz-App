import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import Center from "./Center";
import useForm from "../hooks/useForm";
import { createApiEndpoint, ENDPOINTS } from "../api";
import useStateContext from "../hooks/useStateContext";
import { useNavigate } from "react-router-dom";
import { LoadingButton, loadingButtonClasses } from "@mui/lab";

const getFreshModel = () => ({
  name: "",
  email: "",
});

const Login = () => {
  const navigate = useNavigate();

  const { context, setContext, resetContext } = useStateContext();
  const [loading, setLoading] = useState("Start");
  const { values, setValues, errors, setErrors, handleInputChange } =
    useForm(getFreshModel);

  const login = (e) => {
    e.preventDefault();
    setLoading("Loading...");
    if (validate()) {
      createApiEndpoint(ENDPOINTS.participant)
        .post(values)
        .then((res) => {
          setContext({ participantId: res.data.participantId });
          navigate("/quiz");
        })

        .catch((err) => console.log(err));
    }
    setLoading("Start");
  };

  useEffect(() => {
    resetContext();
  }, []);

  const validate = () => {
    let temp = {};
    temp.email = /\S+@\S+\.\S+/.test(values.email) ? "" : "Email is not valid";
    temp.name = values.name != "" ? "" : "This is a required field";
    setErrors(temp);
    return Object.values(temp).every((x) => x == "");
  };

  return (
    <Center>
      <Card sx={{ width: 400 }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h3" sx={{ my: 3 }}>
            Quiz App
          </Typography>
          <Box
            sx={{
              "& .MuiTextField-root": {
                m: 1,
                width: "90%",
              },
            }}
          >
            <form noValidate onSubmit={login}>
              <TextField
                variant="outlined"
                label="Email"
                onChange={handleInputChange}
                value={values.email}
                name="email"
                {...(errors.email && { error: true, helperText: errors.email })}
              />
              <TextField
                variant="outlined"
                label="Name"
                onChange={handleInputChange}
                value={values.name}
                name="name"
                {...(errors.name && { error: true, helperText: errors.name })}
              />
              {/* <LoadingButton
                loading={loading}
                type="submit"
                variant="contained"
                size="large"
                sx={{ width: "90%" }}
              >
                Start
              </LoadingButton> */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ width: "90%" }}
              >
                {loading}
              </Button>
            </form>
          </Box>
        </CardContent>
      </Card>
    </Center>
  );
};

export default Login;
