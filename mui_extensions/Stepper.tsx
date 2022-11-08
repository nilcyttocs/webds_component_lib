import React from "react";

import Stepper, { StepperProps } from "@mui/material/Stepper";
import { StepIconProps } from "@mui/material/StepIcon";

import { styled } from "@mui/material/styles";

import { STEPPER_ATTRS } from "./constants";

const VerticalStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.5)"
      : "rgba(0, 0, 0, 0.38)",
  width: STEPPER_ATTRS.ICON_SIZE,
  height: STEPPER_ATTRS.ICON_SIZE,
  zIndex: 1,
  color: "#fff",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  ...((ownerState.active || ownerState.completed) && {
    backgroundColor: "#007dc3"
  })
}));

export const VerticalStepIcon = (props: StepIconProps) => {
  const { active, completed, className } = props;

  return (
    <VerticalStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {String(props.icon)}
    </VerticalStepIconRoot>
  );
};

export const VerticalStepper = ({
  sx,
  ...verticalStepperProps
}: StepperProps) => {
  return (
    <Stepper
      orientation="vertical"
      connector={null}
      sx={{
        whiteSpace: "normal",
        "& .MuiStepContent-root": {
          minHeight: STEPPER_ATTRS.CONNECTOR_MIN_HEIGHT + "px",
          marginLeft: STEPPER_ATTRS.CONNECTOR_MARGIN_LEFT + "px"
        },
        ...sx
      }}
      {...verticalStepperProps}
    >
      {verticalStepperProps.children}
    </Stepper>
  );
};
