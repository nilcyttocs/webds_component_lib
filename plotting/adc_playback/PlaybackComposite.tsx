import React, { useContext, useEffect, useState } from "react";

import ImagePlot from "../adc_plots/ImagePlot";
import HybridXPlot from "../adc_plots/HybridXPlot";
import HybridYPlot from "../adc_plots/HybridYPlot";

import { TouchcommADCReport } from "@webds/service";

import { ADCDataContext } from "../local_exports";

const SLOW_X = 3;

const IMAGE_LENGTH = 550;
const HYBRID_HEIGHT = 60;

const HYBRIDY_L_MARGIN = 40;
const HYBRIDY_R_MARGIN = 40;
const HYBRIDY_T_MARGIN = 24;
const HYBRIDY_B_MARGIN = 32;

const IMAGE_L_MARGIN = 0;
const IMAGE_R_MARGIN = 112;
const IMAGE_T_MARGIN = HYBRIDY_T_MARGIN;
const IMAGE_B_MARGIN = HYBRIDY_B_MARGIN;

const HYBRIDX_L_MARGIN =
  HYBRID_HEIGHT + HYBRIDY_L_MARGIN + HYBRIDY_R_MARGIN + IMAGE_L_MARGIN;
const HYBRIDX_R_MARGIN = IMAGE_R_MARGIN;
const HYBRIDX_T_MARGIN = 10;
const HYBRIDX_B_MARGIN = 10;

const imageMargins = {
  l: IMAGE_L_MARGIN,
  r: IMAGE_R_MARGIN,
  t: IMAGE_T_MARGIN,
  b: IMAGE_B_MARGIN
};

const hybridXMargins = {
  l: HYBRIDX_L_MARGIN,
  r: HYBRIDX_R_MARGIN,
  t: HYBRIDX_T_MARGIN,
  b: HYBRIDX_B_MARGIN
};

const hybridYMargins = {
  l: HYBRIDY_L_MARGIN,
  r: HYBRIDY_R_MARGIN,
  t: HYBRIDY_T_MARGIN,
  b: HYBRIDY_B_MARGIN
};

let playbackData: TouchcommADCReport[];

let running: boolean;

let imageWidth: number;

let imageHeight: number;

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

export const PlaybackComposite = (props: any): JSX.Element | null => {
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
    const setWidthHeight = () => {
      const numRows = playbackData[0].image.length;
      const numCols = playbackData[0].image[0].length;
      if (numCols > numRows) {
        imageWidth = props.length !== undefined ? props.length : IMAGE_LENGTH;
        imageHeight = Math.floor((imageWidth * numRows) / numCols);
      } else {
        imageHeight = props.length !== undefined ? props.length : IMAGE_LENGTH;
        imageWidth = Math.floor((imageHeight * numCols) / numRows);
      }
    };
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
      <div style={{ display: "flex", flexWrap: "nowrap" }}>
        <HybridYPlot
          height={imageHeight}
          margins={hybridYMargins}
          report={report}
        />
        <ImagePlot
          length={props.length}
          margins={imageMargins}
          report={report}
        />
      </div>
      <HybridXPlot
        width={imageWidth}
        margins={hybridXMargins}
        report={report}
      />
    </div>
  ) : null;
};

export default PlaybackComposite;
