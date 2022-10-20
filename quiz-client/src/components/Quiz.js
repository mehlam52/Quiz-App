import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  LinearProgress,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL, createApiEndpoint, ENDPOINTS } from "../api";
import { getFormattedTime } from "../helper";
import useStateContext, { stateContext } from "../hooks/useStateContext";

const Quiz = () => {
  const { context, setContext } = useStateContext();
  const [qns, setQns] = useState([]);
  const [qnIndex, setQnIndex] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const navigate = useNavigate();

  let timer;
  const StartTimer = () => {
    timer = setInterval(() => {
      // since sttimetaken is asyncronous instead of timetaken+1 passing prev=> prev+1
      setTimeTaken((prev) => prev + 0.5);
    }, [1000]);
  };
  useEffect(() => {
    setContext({
      timeTaken: 0,
      selectedOptions: [],
    });
    createApiEndpoint(ENDPOINTS.question)
      .fetch()
      .then((res) => {
        setQns(res.data);
        StartTimer();
      });

    return () => {
      clearInterval(timer);
    };
  }, []);

  const updateAnswer = (qnId, optionIdx) => {
    const temp = [...context.selectedOptions];
    temp.push({
      qnId,
      selected: optionIdx,
    });
    if (qnIndex < 4) {
      setContext({ selectedOptions: [...temp] });
      setQnIndex(qnIndex + 1);
    } else {
      setContext({ selectedOptions: [...temp], timeTaken });
      navigate("/result");
    }
  };

  return qns.length != 0 ? (
    <Card
      sx={{
        maxWidth: 640,
        mx: "auto",
        mt: 5,
        "& .MuiCardHeader-action": {
          m: 0,
          alignSelf: "center",
        },
      }}
    >
      <CardHeader
        title={"Question " + (qnIndex + 1) + " of 5"}
        action={<Typography>{getFormattedTime(timeTaken)}</Typography>}
      />

      <Box>
        <LinearProgress
          variant="determinate"
          value={((qnIndex + 1) * 100) / 5}
        />
      </Box>

      {qns[qnIndex].imageName != null ? (
        <CardMedia
          component="img"
          image={BASE_URL + "images/" + qns[qnIndex].imageName}
          sx={{ width: "auto", m: "10px auto" }}
        />
      ) : null}

      <CardContent sx={{ justifyContent: "left" }}>
        <Typography align="left" variant="h6">
          {qns[qnIndex].qnInWords}
        </Typography>
        <List>
          {qns[qnIndex].options.map((item, idx) => (
            <ListItemButton
              key={idx}
              disableRipple
              onClick={() => updateAnswer(qns[qnIndex].qnId, idx)}
            >
              <div>
                <b>{String.fromCharCode(65 + idx) + " . "}</b> {item}
              </div>
            </ListItemButton>
          ))}
        </List>
      </CardContent>
    </Card>
  ) : null;
};

export default Quiz;
