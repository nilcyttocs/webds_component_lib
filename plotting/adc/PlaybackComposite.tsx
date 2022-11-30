import React, { useContext, useEffect, useState } from "react";

import ImagePlot from "./ImagePlot";
import HybridXPlot from "./HybridXPlot";
import HybridYPlot from "./HybridYPlot";

import { TouchcommReport } from "../utils";

import { ADCData, ADCDataContext } from "../local_exports";

const SLOW_X = 3;

const IMAGE_WIDTH = 550;
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

let playbackData: ADCData;

let running: boolean;

let imageHeight: number;

let frameIndex: number;

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
  const [report, setReport] = useState<TouchcommReport>();

  playbackData = useContext(ADCDataContext);

  const animatePlot = () => {
    requestID = requestAnimationFrame(animatePlot);

    if (running) {
      if (animationCounter === SLOW_X) {
        animationCounter = 1;
        props.setFrameIndex(frameIndex);
        setReport(playbackData.data[frameIndex]);
        if (frameIndex + 1 >= props.numFrames) {
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
      setReport(playbackData.data[frameIndex]);
    }
  }, [props.frameIndex]);

  useEffect(() => {
    if (frameIndex + 1 >= props.numFrames) {
      frameIndex = 0;
    }
    running = props.run;
  }, [props.run, props.numFrames]);

  useEffect(() => {
    const initialize = () => {
      const numRows = playbackData.data[0].image.length;
      const numCols = playbackData.data[0].image[0].length;
      imageHeight = Math.floor((IMAGE_WIDTH * numRows) / numCols);
      animationCounter = 1;
      requestID = requestAnimationFrame(animatePlot);
      setInitialized(true);
    };

    if (!initialized) {
      initialize();
    } else {
      stopAnimation();
      props.setRun(false);
      props.setFrameIndex(0);
      animationCounter = 1;
      requestID = requestAnimationFrame(animatePlot);
    }

    return () => {
      stopAnimation();
    };
  }, [playbackData]);

  return initialized ? (
    <div>
      <div style={{ display: "flex", flexWrap: "nowrap" }}>
        <HybridYPlot
          report={report}
          height={imageHeight}
          margins={hybridYMargins}
        />
        <ImagePlot report={report} margins={imageMargins} />
      </div>
      <HybridXPlot report={report} margins={hybridXMargins} />
    </div>
  ) : null;
};

export default PlaybackComposite;
