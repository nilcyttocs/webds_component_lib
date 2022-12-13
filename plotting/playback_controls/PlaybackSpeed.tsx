import React, { useState } from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export const PlaybackSpeed = (props: any): JSX.Element => {
  const [speed, setSpeed] = useState<string>("2");

  const handleChange = (event: SelectChangeEvent) => {
    setSpeed(event.target.value);
    props.setPlaybackSpeed(Number(event.target.value));
  };

  return (
    <FormControl
      sx={{
        minWidth: "100px",
        maxWidth: "100px",
        "& .MuiOutlinedInput-root": { height: "36px", textAlign: "center" },
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
        <MenuItem value={3} sx={{ fontSize: "0.875rem" }}>
          Fast
        </MenuItem>
        <MenuItem value={2} sx={{ fontSize: "0.875rem" }}>
          Normal
        </MenuItem>
        <MenuItem value={1} sx={{ fontSize: "0.875rem" }}>
          Slow
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default PlaybackSpeed;
