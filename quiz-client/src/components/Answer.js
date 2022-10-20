import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CardMedia,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { BASE_URL } from "../api";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import { green, red, grey } from "@mui/material/colors";

const Answer = ({ qnAnswers }) => {
  const [expanded, setExpanded] = useState(false);

  // nestted function
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const markCorrectOrNot = (qna, idx) => {
    if ([qna.answer, qna.selected].includes(idx)) {
      return { sx: { color: qna.answer == idx ? green[500] : red[500] } };
    }
  };

  return (
    <Box sx={{ mt: 5, width: "100%", maxWidth: 640, mx: "auto" }}>
      {qnAnswers?.map((item, j) => (
        <Accordion
          expanded={expanded === j}
          disableGutters
          key={j}
          onChange={handleChange(j)}
        >
          <AccordionSummary
            expandIcon={
              <ExpandCircleDownIcon
                sx={{
                  color: item.answer == item.selected ? green[500] : red[500],
                }}
              />
            }
          >
            <Typography align="left" sx={{ width: "90%", flexShrink: 0 }}>
              {item.qnInWords}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: grey[900] }}>
            {item.imageName != null ? (
              <CardMedia
                component="img"
                image={BASE_URL + "images/" + item.imageName}
                sx={{ width: "auto", m: "10px auto" }}
              />
            ) : null}

            <List>
              {item.options.map((x, idx) => (
                <ListItemButton key={idx} disableRipple>
                  <Typography {...markCorrectOrNot(item, idx)}>
                    <b>{String.fromCharCode(65 + idx) + " . "}</b> {x}
                  </Typography>
                </ListItemButton>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Answer;
