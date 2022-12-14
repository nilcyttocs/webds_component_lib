import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button, { ButtonProps } from "@mui/material/Button";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import { useTheme } from "@mui/material/styles";

const TOGGLE_SELECT_COLOR = "#5AACF6";

const HorizontalFlipIcon = (props: any): JSX.Element => {
  return (
    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <g id="h_flip">
        <path
          fill-rule="evenodd"
          d="m12,22c-5.5248,0 -10,-4.4752 -10,-10c0,-5.5248 4.4752,-10 10,-10c5.5248,0 10,4.4752 10,10c0,5.5248 -4.4752,10 -10,10zm-5,-6.3334c-0.1763,0 -0.3396,-0.0929 -0.4298,-0.2445c-0.0902,-0.1515 -0.0938,-0.3394 -0.0096,-0.4942l4.1666,-7.6666c0.1092,-0.201 0.3409,-0.3022 0.5626,-0.2458c0.2216,0.0563 0.3768,0.2559 0.3768,0.4846l0,7.6666c0,0.2762 -0.2238,0.5 -0.5,0.5l-4.1666,0l0,-0.0001zm10.4298,-0.2445c-0.0902,0.1516 -0.2534,0.2445 -0.4298,0.2445l-4.1666,0c-0.2762,0 -0.5,-0.2238 -0.5,-0.5l0,-7.6666c0,-0.2286 0.1552,-0.4282 0.3768,-0.4846c0.2217,-0.0563 0.4534,0.045 0.5626,0.2458l4.1666,7.6666c0.0842,0.155 0.0806,0.3427 -0.0096,0.4942l0,0.0001zm-4.0964,-5.9551l0,5.1996l2.8258,0l-2.8258,-5.1996z"
          id="h_flip"
        />
      </g>
    </svg>
  );
};

const VerticalFlipIcon = (props: any): JSX.Element => {
  return (
    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-90,12,12)" id="v_flip">
        <path
          fill-rule="evenodd"
          d="m12,22c-5.5248,0 -10,-4.4752 -10,-10c0,-5.5248 4.4752,-10 10,-10c5.5248,0 10,4.4752 10,10c0,5.5248 -4.4752,10 -10,10zm-5,-6.3334c-0.1763,0 -0.3396,-0.0929 -0.4298,-0.2445c-0.0902,-0.1515 -0.0938,-0.3394 -0.0096,-0.4942l4.1666,-7.6666c0.1092,-0.201 0.3409,-0.3022 0.5626,-0.2458c0.2216,0.0563 0.3768,0.2559 0.3768,0.4846l0,7.6666c0,0.2762 -0.2238,0.5 -0.5,0.5l-4.1666,0l0,-0.0001zm10.4298,-0.2445c-0.0902,0.1516 -0.2534,0.2445 -0.4298,0.2445l-4.1666,0c-0.2762,0 -0.5,-0.2238 -0.5,-0.5l0,-7.6666c0,-0.2286 0.1552,-0.4282 0.3768,-0.4846c0.2217,-0.0563 0.4534,0.045 0.5626,0.2458l4.1666,7.6666c0.0842,0.155 0.0806,0.3427 -0.0096,0.4942l0,0.0001zm-4.0964,-5.9551l0,5.1996l2.8258,0l-2.8258,-5.1996z"
          id="v_flip"
        />
      </g>
    </svg>
  );
};

interface FlipToggleProps extends IconButtonProps {
  horizontal: boolean;
  flip: boolean;
}

export const FlipToggle = ({
  horizontal,
  flip,
  sx,
  ...hFlipToggleProps
}: FlipToggleProps) => {
  return (
    <IconButton sx={{ padding: "0px", ...sx }} {...hFlipToggleProps}>
      <SvgIcon
        color="primary"
        sx={{
          fontSize: "2.5rem",
          fill: flip ? TOGGLE_SELECT_COLOR : "currentColor"
        }}
      >
        {horizontal ? <HorizontalFlipIcon /> : <VerticalFlipIcon />}
      </SvgIcon>
    </IconButton>
  );
};

const PositionViewIcon = (props: any): JSX.Element => {
  return (
    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <g id="position_view">
        <path
          id="position_view"
          d="m12,22c-5.5248,0 -10,-4.4752 -10,-10c0,-5.5248 4.4752,-10 10,-10c5.5248,0 10,4.4752 10,10c0,5.5248 -4.4752,10 -10,10m-0.375,-12.8125c-0.8978,0 -1.625,-0.7831 -1.625,-1.75c0,-0.9668 0.7272,-1.75 1.625,-1.75c0.8978,0 1.625,0.7832 1.625,1.75c0,0.9669 -0.7272,1.75 -1.625,1.75zm0.375,12.8125c-5.5248,0 -10,-4.4752 -10,-10c0,-5.5248 4.4752,-10 10,-10c5.5248,0 10,4.4752 10,10c0,5.5248 -4.4752,10 -10,10m-3.75,-8.0625c-0.8978,0 -1.625,-0.7831 -1.625,-1.75c0,-0.9669 0.7272,-1.75 1.625,-1.75c0.8978,0 1.625,0.7831 1.625,1.75c0,0.9669 -0.7272,1.75 -1.625,1.75zm3.75,8.0625c-5.5248,0 -10,-4.4752 -10,-10c0,-5.5248 4.4752,-10 10,-10c5.5248,0 10,4.4752 10,10c0,5.5248 -4.4752,10 -10,10m3,-4.5625c-0.8978,0 -1.625,-0.7831 -1.625,-1.75c0,-0.9669 0.7272,-1.75 1.625,-1.75c0.8978,0 1.625,0.7831 1.625,1.75c0,0.9669 -0.7272,1.75 -1.625,1.75z"
          fill-rule="evenodd"
        />
      </g>
    </svg>
  );
};

const TraceViewIcon = (props: any): JSX.Element => {
  return (
    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <g id="trace_view">
        <path
          id="trace_view"
          d="m12,22c-5.5248,0 -10,-4.4752 -10,-10c0,-5.5248 4.4752,-10 10,-10c5.5248,0 10,4.4752 10,10c0,5.5248 -4.4752,10 -10,10zm6.7841,-8.3268c-0.0695,-0.0835 -1.2839,-1.5141 -3.3499,-2.3156c-0.1182,-0.998 -0.498,-1.9075 -1.0985,-2.6106c-0.8421,-0.9859 -2.0565,-1.507 -3.5117,-1.507c-2.8854,0 -4.7659,2.5863 -4.8445,2.6964a0.448,0.448 90 0 0 0.7287,0.5214c0.0166,-0.0233 1.6973,-2.3218 4.1158,-2.3218c1.185,0 2.1638,0.4125 2.8304,1.193a3.8728,3.8728 90 0 1 0.8229,1.7243a7.668,7.668 90 0 0 -1.8613,-0.2293c-1.4594,0 -2.6846,0.3813 -3.543,1.1027c-0.7593,0.6382 -1.1949,1.5272 -1.1949,2.4392a2.665,2.665 90 0 0 0.7769,1.9071c0.541,0.5384 1.291,0.823 2.169,0.823c1.4125,0 2.6146,-0.5587 3.4762,-1.6156c0.684,-0.839 1.1005,-1.9654 1.1647,-3.1305c1.6454,0.743 2.617,1.8803 2.631,1.8969a0.448,0.448 90 1 0 0.6882,-0.5736zm-7.9601,2.5268c-1.416,0 -2.0499,-0.9212 -2.0499,-1.8341c0,-1.2743 1.2023,-2.6459 3.8419,-2.6459a6.7201,6.7201 90 0 1 1.9616,0.2953c0,0.0061 0.0001,0.0123 0.0001,0.0185c0,2.0703 -1.2894,4.1662 -3.7537,4.1662z"
          fill-rule="evenodd"
        />
      </g>
    </svg>
  );
};

interface TouchViewToggleProps extends IconButtonProps {
  traceView: boolean;
}

export const TouchViewToggle = ({
  traceView,
  sx,
  ...touchViewToggleProps
}: TouchViewToggleProps) => {
  return (
    <IconButton sx={{ padding: "0px", ...sx }} {...touchViewToggleProps}>
      <SvgIcon color="primary" sx={{ fontSize: "2.5rem" }}>
        {traceView ? <PositionViewIcon /> : <TraceViewIcon />}
      </SvgIcon>
    </IconButton>
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
