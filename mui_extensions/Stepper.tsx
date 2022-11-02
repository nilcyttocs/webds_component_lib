import React from "react";

import Stepper, { StepperProps } from "@mui/material/Stepper";
import StepConnector, { StepConnectorProps } from "@mui/material/StepConnector";

import { STEPPER_ATTRS } from "./constants";

interface VerticalStepConnectorProps extends StepConnectorProps {
  minConnectorHeight?: number | null;
}

const VerticalStepConnector = ({
  minConnectorHeight = null,
  sx,
  ...verticalStepConnectorProps
}: VerticalStepConnectorProps) => {
  return (
    <StepConnector
      sx={{
        "& .MuiStepConnector-line": {
          minHeight:
            (minConnectorHeight
              ? minConnectorHeight
              : STEPPER_ATTRS.CONNECTOR_MIN_HEIGHT) + "px",
          marginLeft: STEPPER_ATTRS.CONNECTOR_MARGIN_LEFT + "px"
        },
        ...sx
      }}
      {...verticalStepConnectorProps}
    />
  );
};

interface VerticalStepperProps extends StepperProps {
  minConnectorHeight?: number | null;
}

export const VerticalStepper = ({
  minConnectorHeight = null,
  sx,
  ...verticalStepperProps
}: VerticalStepperProps) => {
  return (
    <Stepper
      orientation="vertical"
      connector={
        <VerticalStepConnector minConnectorHeight={minConnectorHeight} />
      }
      sx={{
        "& .MuiStepIcon-root": {
          width: STEPPER_ATTRS.ICON_SIZE + "px",
          height: STEPPER_ATTRS.ICON_SIZE + "px"
        },
        ...sx
      }}
      {...verticalStepperProps}
    >
      {verticalStepperProps.children}
    </Stepper>
  );
};
