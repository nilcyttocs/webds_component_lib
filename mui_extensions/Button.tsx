import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button, { ButtonProps } from "@mui/material/Button";
import ToggleButton, { ToggleButtonProps } from "@mui/material/ToggleButton";
import SvgIcon from "@mui/material/SvgIcon";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import { useTheme } from "@mui/material/styles";

const HorizontalFlipIcon = (props: any): JSX.Element => {
  return (
    <svg
      width="18px"
      height="18px"
      viewBox="-3.5 -4 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 17.5C4.2355 17.5 3.99056 17.3607 3.85537 17.1333C3.72018 16.906 3.71473 16.6243 3.84103 16.3919L10.091 4.89187C10.2548 4.59046 10.6023 4.43861 10.9348 4.52312C11.2672 4.60763 11.5 4.90696 11.5 5.25001V16.75C11.5 17.1642 11.1642 17.5 10.75 17.5H4.5Z"
        fill="#007dc3"
      />
      <path
        d="M20.1446 17.1333C20.0094 17.3607 19.7645 17.5 19.5 17.5H13.25C12.8358 17.5 12.5 17.1642 12.5 16.75V5.25001C12.5 4.90696 12.7328 4.60763 13.0652 4.52312C13.3977 4.43861 13.7452 4.59046 13.909 4.89187L20.159 16.3919C20.2853 16.6243 20.2798 16.906 20.1446 17.1333ZM14 8.20065V16H18.2388L14 8.20065Z"
        fill="#007dc3"
      />
    </svg>
  );
};

export const HFlipToggle = ({ sx, ...hFlipToggleProps }: ToggleButtonProps) => {
  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <ToggleButton
        sx={{
          width: "33.35px",
          height: "33.35px",
          padding: "0px",
          borderRadius: "50%",
          borderColor: "#007dc3",
          "& .MuiSvgIcon-root": {
            fontSize: "2.5rem"
          },
          ...sx
        }}
        {...hFlipToggleProps}
      >
        <SvgIcon>
          <HorizontalFlipIcon />
        </SvgIcon>
      </ToggleButton>
    </div>
  );
};

const VerticalFlipIcon = (props: any): JSX.Element => {
  return (
    <svg
      width="18px"
      height="18px"
      viewBox="-3.5 -4 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.5001 4.5C17.5001 4.2355 17.3607 3.99056 17.1334 3.85537C16.9061 3.72018 16.6243 3.71473 16.3919 3.84103L4.89194 10.091C4.59052 10.2548 4.43867 10.6023 4.52318 10.9348C4.6077 11.2672 4.90702 11.5 5.25007 11.5H16.7501C17.1643 11.5 17.5001 11.1642 17.5001 10.75V4.5ZM15.5 9.5H10.1677L15.5 6.60203V9.5Z"
        fill="#007dc3"
      />
      <path
        d="M17.5001 19.5C17.5001 19.7645 17.3607 20.0094 17.1334 20.1446C16.9061 20.2798 16.6243 20.2853 16.3919 20.159L4.89194 13.909C4.59052 13.7452 4.43867 13.3977 4.52318 13.0652C4.6077 12.7328 4.90702 12.5 5.25007 12.5H16.7501C17.1643 12.5 17.5001 12.8358 17.5001 13.25V19.5Z"
        fill="#007dc3"
      />
    </svg>
  );
};

export const VFlipToggle = ({ sx, ...vFlipToggleProps }: ToggleButtonProps) => {
  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <ToggleButton
        sx={{
          width: "33.35px",
          height: "33.35px",
          padding: "0px",
          borderRadius: "50%",
          borderColor: "#007dc3",
          "& .MuiSvgIcon-root": {
            fontSize: "2.5rem"
          },
          ...sx
        }}
        {...vFlipToggleProps}
      >
        <SvgIcon>
          <VerticalFlipIcon />
        </SvgIcon>
      </ToggleButton>
    </div>
  );
};

export const TraceViewIcon = (props: any): JSX.Element => {
  return (
    <svg
      width="18px"
      height="18px"
      viewBox="-80 -80 320 320"
      id="Flat"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M249.21875,152.31787c-1.25195-1.50195-22.68555-26.75586-59.22949-41.61865C187.48242,93.02,180.5127,76.91406,169.75,64.31348,153.92871,45.79053,131.19336,36,104,36,50.44043,36,15.68848,83.79053,14.23535,85.82471A12,12,0,0,0,33.76465,99.7749C34.04883,99.37695,62.65332,60,104,60c19.95508,0,36.38086,6.88184,47.501,19.90088a63.27413,63.27413,0,0,1,12.249,22.86474A140.31271,140.31271,0,0,0,136,100c-27.01465,0-49.78223,7.13379-65.84082,20.62988-14.4668,12.15723-22.76367,29.14942-22.76367,46.61866C47.39551,193.46289,66.83887,220,104,220c26.46582,0,49.00293-10.48535,65.17578-30.32227,11.582-14.207,19.04492-32.80566,21.2041-52.32714a140.49026,140.49026,0,0,1,40.40137,30.33154,12,12,0,1,0,18.4375-15.36426ZM104,196c-22.52246,0-32.60449-14.44043-32.60449-28.75146C71.39551,146.419,91.6123,124,136,124a115.60347,115.60347,0,0,1,30.98828,4.26367C165.9209,162.35889,144.33105,196,104,196Z"
        fill="#007dc3"
      />
    </svg>
  );
};

export const TraceViewToggle = ({
  sx,
  ...traceViewToggleProps
}: ToggleButtonProps) => {
  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <ToggleButton
        sx={{
          width: "33.35px",
          height: "33.35px",
          padding: "0px",
          borderRadius: "50%",
          borderColor: "#007dc3",
          "& .MuiSvgIcon-root": {
            fontSize: "2.5rem"
          },
          ...sx
        }}
        {...traceViewToggleProps}
      >
        <SvgIcon>
          <TraceViewIcon />
        </SvgIcon>
      </ToggleButton>
    </div>
  );
};

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
  progressMessage?: string | null;
}

export const ProgressButton = ({
  progress,
  onClick,
  onDoneClick,
  onCancelClick = undefined,
  onResetClick = undefined,
  progressMessage = null,
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
                {onCancelClick !== undefined
                  ? "Cancel"
                  : progressMessage
                  ? progressMessage
                  : "Processing..."}
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
