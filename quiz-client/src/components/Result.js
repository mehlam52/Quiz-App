import {
  Alert,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApiEndpoint, ENDPOINTS } from "../api";
import { getFormattedTime } from "../helper";
import useStateContext from "../hooks/useStateContext";
import { green } from "@mui/material/colors";
import Answer from "./Answer";

const Result = () => {
  const { context, setContext } = useStateContext();

  const navigate = useNavigate();
  const [score, setScore] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [qnAnswers, setQnAnswers] = useState();

  useEffect(() => {
    const ids = context.selectedOptions.map((x) => x.qnId);
    createApiEndpoint(ENDPOINTS.getAnswers)
      .post(ids)
      .then((res) => {
        const qna = context.selectedOptions.map((x) => ({
          ...x,
          ...res.data.find((y) => y.qnId == x.qnId),
        }));
        setQnAnswers(qna);
        calculateScore(qna);
      })
      .catch((err) => console.log(err));
  }, []);

  const calculateScore = (qna) => {
    let tempScore = qna.reduce((acc, curr) => {
      return curr.answer == curr.selected ? acc + 1 : acc;
    }, 0);
    console.log("score>>>", tempScore);
    setScore(tempScore);
  };

  const restart = () => {
    setContext({
      timeTaken: 0,
      selectedOptions: [],
    });
    navigate("/quiz");
  };

  const SubmitScore = () => {
    createApiEndpoint(ENDPOINTS.participant)
      .put(context.participantId, {
        timeTaken: context.timeTaken,
        score: score,
        participantId: context.participantId,
      })
      .then((res) => {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Card
        sx={{
          mt: 5,
          display: "flex",
          width: "100%",
          maxWidth: 640,
          mx: "auto",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <CardContent sx={{ flex: "1 0 auto", textAlign: "center" }}>
            <Typography variant="h4">Congratulations!</Typography>
            <Typography variant="h6">YOUR SCORE</Typography>
            <Typography variant="h5">
              <Typography variant="span" color={green[500]}>
                {score}
              </Typography>
              /5
            </Typography>
            <Typography variant="h6">
              Took {getFormattedTime(context.timeTaken) + " mins"}
            </Typography>
            <Button
              onClick={SubmitScore}
              variant="contained"
              sx={{ mx: 1 }}
              size="small"
            >
              Submit
            </Button>
            <Button
              variant="contained"
              sx={{ mx: 1 }}
              size="small"
              onClick={restart}
            >
              Re-try
            </Button>
            <Alert
              severity="success"
              variant="string"
              sx={{
                width: "60%",
                m: "auto",
                visibility: showAlert ? "visible" : "hidden",
              }}
            >
              Score Updated
            </Alert>
          </CardContent>
        </Box>
        <CardMedia component="img" sx={{ width: 220 }} image="./result.png" />
      </Card>
      <Answer qnAnswers={qnAnswers} />
    </>
  );
};

export default Result;
