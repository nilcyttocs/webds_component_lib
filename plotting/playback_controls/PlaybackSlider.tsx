import React, { useEffect, useState } from 'react';

import Slider from '@mui/material/Slider';

export const PlaybackSlider = (props: any): JSX.Element => {
  const [index, setIndex] = useState<number>(props.frameIndex + 1);

  const handleSliderChange = (event: any) => {
    setIndex(event.target.value);
    props.setFrameIndex(event.target.value - 1);
  };

  useEffect(() => {
    setIndex(props.frameIndex + 1);
  }, [props.frameIndex]);

  return (
    <Slider
      value={index}
      disabled={props.numFrames === 0}
      min={1}
      max={props.numFrames === 0 ? Number.MAX_VALUE : props.numFrames}
      valueLabelDisplay="auto"
      onChange={handleSliderChange}
    />
  );
};

export default PlaybackSlider;
