import React, { useEffect, useState } from 'react';

import LinearProgress from '@mui/material/LinearProgress';

export const PlaybackProgress = (props: any): JSX.Element => {
  const [progress, setProgress] = useState<number>(
    Math.ceil(((props.frameIndex + 1) * 100) / props.numFrames)
  );
  const [transition, setTransition] = useState<string>(
    'transform 100ms linear'
  );

  useEffect(() => {
    if (props.frameIndex === 0) {
      setTransition('transform 0ms linear');
    } else {
      setTransition('transform 10ms linear');
    }
    setProgress(Math.ceil(((props.frameIndex + 1) * 100) / props.numFrames));
  }, [props.frameIndex, props.numFrames]);

  return (
    <LinearProgress
      variant="determinate"
      value={progress}
      sx={{
        '& .MuiLinearProgress-bar': {
          transition: transition
        }
      }}
    />
  );
};

export default PlaybackProgress;
