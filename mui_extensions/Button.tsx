import React from "react";

import Button, { ButtonProps } from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

export const BackButton = ({ sx, ...muiButtonProps }: ButtonProps) => {
  return (
    <Button variant="text" sx={{ padding: 0, ...sx }} {...muiButtonProps}>
      <KeyboardArrowLeft />
      Back
    </Button>
  );
};

export const NextButton = ({ sx, ...muiButtonProps }: ButtonProps) => {
  return (
    <Button variant="text" sx={{ padding: 0, ...sx }} {...muiButtonProps}>
      Next
      <KeyboardArrowRight />
    </Button>
  );
};
