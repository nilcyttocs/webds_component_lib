import "@mui/material/Typography";
import "@mui/material/StepIcon";

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    underline: true;
  }
}

declare module "@mui/material/StepIcon" {
  interface StepIconProps {
    onStepClick: (clickedStep: number) => void;
    onStepHover: (hoveredStep: number) => void;
  }
}
