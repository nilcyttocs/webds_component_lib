import React from "react";

import Paper, { PaperProps } from "@mui/material/Paper";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { useTheme } from "@mui/material/styles";

import { CANVAS_ATTRS } from "./constants";

interface CanvasProps extends PaperProps {
  title: string;
  width?: number | null;
  showHelp?: boolean;
}

export const Canvas = ({
  title,
  width = null,
  showHelp = false,
  sx,
  ...canvasProps
}: CanvasProps) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={7}
      sx={{
        width: (width ? width : CANVAS_ATTRS.WIDTH) + "px",
        borderStyle: "solid",
        borderWidth: theme.palette.mode === "light" ? "0px" : "1px",
        borderColor: "canvas.border",
        borderRadius: "10px",
        ...sx
      }}
      {...canvasProps}
    >
      <Stack spacing={0} divider={<Divider orientation="horizontal" />}>
        <Box
          sx={{
            width: (width ? width : CANVAS_ATTRS.WIDTH) + "px",
            height: CANVAS_ATTRS.HEIGHT_TITLE + "px",
            padding: CANVAS_ATTRS.PADDING + "px",
            boxSizing: "border-box",
            position: "relative"
          }}
        >
          <Typography
            variant="h5"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            {title}
          </Typography>
          {showHelp && (
            <Button
              variant="text"
              sx={{
                position: "absolute",
                top: "50%",
                left: "16px",
                transform: "translate(0%, -50%)"
              }}
            >
              <Typography variant="underline">Help</Typography>
            </Button>
          )}
        </Box>
        {canvasProps.children}
      </Stack>
    </Paper>
  );
};
