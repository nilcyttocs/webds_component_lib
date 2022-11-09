import "@mui/material/Typography";
import "@mui/material/StepIcon";

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    underline: true;
  }
}

declare module "@mui/material/StepIcon" {
  interface StepIconProps {
    onClick: (clickedStep: number) => void;
  }
}
