import React, { useContext, useEffect, useState } from "react";

import ImagePlot from "../adc_plots/ImagePlot";

import { TouchcommADCReport } from "@webds/service";

import { ADCDataContext } from "../local_exports";

const SLOW_X = 3;

const IMAGE_LENGTH = 550;

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
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);
  const [swapXY, setSwapXY] = useState<boolean>(false);

  playbackData = useContext(ADCDataContext);

  const setWidthHeight = () => {
    const numRows = playbackData[0].image.length;
    const numCols = playbackData[0].image[0].length;
    let imageWidth: number;
    let imageHeight: number;
    if (numCols > numRows) {
      imageWidth = props.length !== undefined ? props.length : IMAGE_LENGTH;
      imageHeight = Math.floor((imageWidth * numRows) / numCols);
    } else {
      imageHeight = props.length !== undefined ? props.length : IMAGE_LENGTH;
      imageWidth = Math.floor((imageHeight * numCols) / numRows);
    }
    if (props.portrait && imageWidth > imageHeight) {
      setSwapXY(true);
      setImageWidth(imageHeight);
      setImageHeight(imageWidth);
    } else {
      setSwapXY(false);
      setImageWidth(imageWidth);
      setImageHeight(imageHeight);
    }
  };

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
    setWidthHeight();
  }, [props.dataCounter]);

  useEffect(() => {
    const initialize = () => {
      setWidthHeight();
      animationCounter = 1;
      requestID = requestAnimationFrame(animatePlot);
      setInitialized(true);
    };

    if (props.passive) {
      if (!initialized) {
        setWidthHeight();
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
        width={imageWidth}
        height={imageHeight}
        margins={imageMargins}
        swapXY={swapXY}
        flip={props.flip}
        showScale={false}
        report={report}
      />
    </div>
  ) : null;
};

export default PlaybackImage;
