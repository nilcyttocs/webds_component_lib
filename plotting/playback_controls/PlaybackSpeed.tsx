import React, { useEffect, useState } from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const DEFAULT_SPEED = "Normal";

const convertSpeedtoNum = (speed: string) => {
  switch (speed) {
    case "Fast":
      return 3;
    case "Normal":
      return 2;
    case "Slow":
      return 1;
  }
};

export const PlaybackSpeed = (props: any): JSX.Element => {
  const [speed, setSpeed] = useState<string>(DEFAULT_SPEED);

  const handleChange = (event: SelectChangeEvent) => {
    setSpeed(event.target.value);
    props.setPlaybackSpeed(convertSpeedtoNum(event.target.value));
  };

  useEffect(() => {
    props.setPlaybackSpeed(convertSpeedtoNum(DEFAULT_SPEED));
  }, []);

  return (
    <FormControl
      sx={{
        minWidth: "100px",
        maxWidth: "100px",
        "& .MuiOutlinedInput-root": { height: "40px", textAlign: "center" },
        "& .MuiSelect-icon": { width: "0.75em", height: "0.75em" }
      }}
    >
      <InputLabel>Speed</InputLabel>
      <Select
        disabled={props.disabled}
        value={speed}
        label="Speed"
        onChange={handleChange}
        sx={{ fontSize: "0.875rem" }}
      >
        <MenuItem value={"Fast"} sx={{ fontSize: "0.875rem" }}>
          Fast
        </MenuItem>
        <MenuItem value={"Normal"} sx={{ fontSize: "0.875rem" }}>
          Normal
        </MenuItem>
        <MenuItem value={"Slow"} sx={{ fontSize: "0.875rem" }}>
          Slow
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default PlaybackSpeed;
