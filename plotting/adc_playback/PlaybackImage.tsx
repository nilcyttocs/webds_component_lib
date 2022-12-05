import React, { useContext, useEffect, useState } from "react";

import ImagePlot from "../adc_plots/ImagePlot";

import { TouchcommADCReport } from "@webds/service";

import { ADCDataContext } from "../local_exports";

const SLOW_X = 3;

const IMAGE_L_MARGIN = 0;
const IMAGE_R_MARGIN = 0;
const IMAGE_T_MARGIN = 0;
const IMAGE_B_MARGIN = 0;

const imageMargins = {
  l: IMAGE_L_MARGIN,
  r: IMAGE_R_MARGIN,
  t: IMAGE_T_MARGIN,
  b: IMAGE_B_MARGIN
};

let playbackData: TouchcommADCReport[];

let running: boolean;

let frameIndex: number;

let numFrames: number;

let requestID: number | undefined;

let animationCounter: number;

const stopAnimation = () => {
  if (requestID) {
    cancelAnimationFrame(requestID);
    requestID = undefined;
  }
};

export const PlaybackImage = (props: any): JSX.Element | null => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [report, setReport] = useState<TouchcommADCReport>();

  playbackData = useContext(ADCDataContext);

  const animatePlot = () => {
    requestID = requestAnimationFrame(animatePlot);

    if (running) {
      if (animationCounter === SLOW_X) {
        animationCounter = 1;
        props.setFrameIndex(frameIndex);
        setReport(playbackData[frameIndex]);
        if (frameIndex + 1 >= numFrames) {
          props.setRun(false);
        } else {
          frameIndex += 1;
        }
      }
      animationCounter++;
    }
  };

  useEffect(() => {
    if (!running) {
      frameIndex = props.frameIndex;
      setReport(playbackData[frameIndex]);
    }
  }, [props.frameIndex, playbackData]);

  useEffect(() => {
    numFrames = props.numFrames;
  }, [props.numFrames]);

  useEffect(() => {
    if (props.passive) {
      return;
    }
    if (frameIndex + 1 >= props.numFrames) {
      frameIndex = 0;
    }
    running = props.run;
  }, [props.passive, props.run, props.numFrames]);

  useEffect(() => {
    const initialize = () => {
      animationCounter = 1;
      requestID = requestAnimationFrame(animatePlot);
      setInitialized(true);
    };

    if (props.passive) {
      if (!initialized) {
        setInitialized(true);
      }
      return;
    }

    if (!initialized) {
      initialize();
    }

    return () => {
      stopAnimation();
    };
  }, []);

  return initialized ? (
    <div>
      <ImagePlot
        length={props.length}
        portrait={props.portrait}
        flip={props.flip}
        report={report}
        margins={imageMargins}
        showScale={false}
      />
    </div>
  ) : null;
};

export default PlaybackImage;
