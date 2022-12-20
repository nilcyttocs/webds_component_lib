import React, { useEffect, useState } from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const DEFAULT_RATE = "30";

const FONT_SIZE = "0.875rem";

const rates = [60, 50, 40, 30, 20, 10];

export const RenderRate = (props: any): JSX.Element => {
  const [rate, setRate] = useState<string>(DEFAULT_RATE);

  const handleChange = (event: SelectChangeEvent) => {
    setRate(event.target.value);
    props.setRenderRate(Number(event.target.value));
  };

  useEffect(() => {
    props.setRenderRate(Number(DEFAULT_RATE));
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
      <InputLabel sx={{ fontSize: FONT_SIZE }}>Render</InputLabel>
      <Select
        disabled={props.disabled}
        value={rate}
        label="Render"
        onChange={handleChange}
        sx={{ fontSize: FONT_SIZE }}
      >
        {rates.map((item) => {
          return (
            <MenuItem key={item} value={item} sx={{ fontSize: FONT_SIZE }}>
              {item} fps
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default RenderRate;
