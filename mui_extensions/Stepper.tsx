import React, { useEffect, useState } from "react";

import Stepper, { StepperProps } from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import { StepIconProps } from "@mui/material/StepIcon";

import Typography from "@mui/material/Typography";

import { styled, useTheme } from "@mui/material/styles";

import { STEPPER_ATTRS } from "./constants";

const HOVERED_COLOR_LIGHT = "rgba(0, 0, 0, 0.53)";
const HOVERED_COLOR_DARK = "rgba(255, 255, 255, 0.65)";

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
  "&:hover": !ownerState.active && {
    cursor: "pointer",
    backgroundColor:
      theme.palette.mode === "dark" ? HOVERED_COLOR_DARK : HOVERED_COLOR_LIGHT
  },
  ...(ownerState.active && { backgroundColor: "#007dc3" })
}));

const VerticalStepIcon = (props: StepIconProps) => {
  const { active, completed, className } = props;
  return (
    <VerticalStepIconRoot
      ownerState={{ completed, active }}
      className={className}
      onClick={() => {
        props.onClick((props.icon as number) - 1);
      }}
      onMouseOver={() => {
        props.onHover((props.icon as number) - 1);
      }}
    >
      {String(props.icon)}
    </VerticalStepIconRoot>
  );
};

type Steps = {
  label: string;
  content?: JSX.Element;
}[];

interface VerticalStepperProps extends StepperProps {
  steps: Steps;
  onStepClick?: (clickedStep: number) => void;
}

export const VerticalStepper = ({
  steps,
  onStepClick,
  activeStep,
  sx,
  ...verticalStepperProps
}: VerticalStepperProps) => {
  const [activeVerticalStep, setActiveVerticalStep] = useState<
    number | undefined
  >(undefined);
  const [hoveredVerticalStep, setHoveredVerticalStep] = useState<
    number | undefined
  >(undefined);

  const theme = useTheme();

  useEffect(() => {
    setActiveVerticalStep(activeStep);
  }, [activeStep]);

  return (
    <Stepper
      activeStep={activeVerticalStep}
      orientation="vertical"
      connector={null}
      sx={{
        whiteSpace: "normal",
        "& .MuiStepContent-root": {
          minHeight: STEPPER_ATTRS.CONNECTOR_MIN_HEIGHT + "px",
          marginLeft: STEPPER_ATTRS.ICON_SIZE / 2 + "px"
        },
        ...sx
      }}
      {...verticalStepperProps}
    >
      {steps.map((step, index) => (
        <Step key={step.label}>
          <StepLabel
            StepIconComponent={VerticalStepIcon}
            StepIconProps={{
              onClick: (clickedStep: number) => {
                setActiveVerticalStep(clickedStep);
                if (onStepClick) {
                  onStepClick(clickedStep);
                }
              },
              onHover: (hoveredStep: number) => {
                setHoveredVerticalStep(hoveredStep);
              }
            }}
          >
            <Typography
              sx={{
                color:
                  index !== activeVerticalStep
                    ? index === hoveredVerticalStep
                      ? theme.palette.mode === "dark"
                        ? HOVERED_COLOR_DARK
                        : HOVERED_COLOR_LIGHT
                      : theme.palette.text.disabled
                    : theme.palette.text.primary
              }}
            >
              {step.label}
            </Typography>
          </StepLabel>
          <StepContent>{step.content}</StepContent>
        </Step>
      ))}
    </Stepper>
  );
};
