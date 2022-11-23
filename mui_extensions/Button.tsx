import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button, { ButtonProps } from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import { useTheme } from "@mui/material/styles";

export const BackButton = ({ sx, ...backButtonProps }: ButtonProps) => {
  return (
    <Button variant="text" sx={{ padding: 0, ...sx }} {...backButtonProps}>
      <KeyboardArrowLeft />
      Prev
    </Button>
  );
};

export const NextButton = ({ sx, ...nextButtonProps }: ButtonProps) => {
  return (
    <Button variant="text" sx={{ padding: 0, ...sx }} {...nextButtonProps}>
      Next
      <KeyboardArrowRight />
    </Button>
  );
};

interface ProgressButtonProps extends ButtonProps {
  progress: number | undefined;
  onDoneClick: () => void;
  onCancelClick?: () => void;
  onResetClick?: () => void;
}

export const ProgressButton = ({
  progress,
  onClick,
  onDoneClick,
  onCancelClick = undefined,
  onResetClick = undefined,
  sx,
  ...progressButtonProps
}: ProgressButtonProps) => {
  const theme = useTheme();
  return (
    <div style={{ position: "relative" }}>
      <Button
        disabled={
          onCancelClick === undefined &&
          progress !== undefined &&
          progress !== 100
        }
        onClick={
          progress === undefined
            ? onClick
            : progress === 100
            ? onDoneClick
            : onCancelClick
        }
        sx={{
          width: "125px",
          padding: "5px 15px",
          position: "relative",
          border: "1px solid",
          borderColor:
            progress === undefined || progress === 100
              ? "rgba(0, 0, 0, 0)"
              : theme.palette.primary.main,
          color: progress !== undefined && progress !== 100 ? "black" : null,
          backgroundColor:
            progress !== undefined && progress !== 100
              ? "rgba(0, 0, 0, 0.12)"
              : null,
          "&:hover": {
            backgroundColor:
              progress !== undefined && progress !== 100
                ? "rgba(0, 0, 0, 0.12)"
                : null
          },
          ...sx
        }}
        {...progressButtonProps}
      >
        {progress !== undefined && progress !== 100 && (
          <>
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
              }}
            >
              <Box
                sx={{
                  width: progress + "%",
                  height: "100%",
                  borderRadius: "4px",
                  backgroundColor: "custom.progress",
                  transition: "width 0.5s"
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              }}
            >
              <Typography
                variant="button"
                sx={{ color: "black", textTransform: "none" }}
              >
                {onCancelClick !== undefined ? "Cancel" : "Processing..."}
              </Typography>
            </div>
          </>
        )}
        {progress !== undefined ? (
          progress === 100 ? (
            "Done"
          ) : (
            <>&nbsp;</>
          )
        ) : (
          progressButtonProps.children
        )}
      </Button>
      {onResetClick !== undefined && progress === 100 && (
        <IconButton
          onClick={(event) => {
            onResetClick();
          }}
          sx={{
            padding: 0,
            position: "absolute",
            bottom: 16,
            right: -32,
            color: theme.palette.primary.main
          }}
        >
          <RestartAltIcon />
        </IconButton>
      )}
    </div>
  );
};
