import React, { useContext, useEffect, useState } from "react";

import ImagePlot from "./ImagePlot";
import HybridXPlot from "./HybridXPlot";
import HybridYPlot from "./HybridYPlot";

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

type Margins = {
  l: number;
  r: number;
  t: number;
  b: number;
};

const zeroMargins: Margins = {
  l: 0,
  r: 0,
  t: 0,
  b: 0
};

let playbackData: TouchcommADCReport[];

let running: boolean;

let slowX: number;

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

export const ADCPlayback = (props: any): JSX.Element | null => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [report, setReport] = useState<TouchcommADCReport>();
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);
  const [imageMargins, setImageMargins] = useState<Margins>(zeroMargins);
  const [hybridXMargins, setHybridXMargins] = useState<Margins>(zeroMargins);
  const [hybridYMargins, setHybridYMargins] = useState<Margins>(zeroMargins);
  const [swapXY, setSwapXY] = useState<boolean>(false);

  playbackData = useContext(ADCDataContext);

  const setWidthHeight = () => {
    const numRows = playbackData[0].image.length;
    const numCols = playbackData[0].image[0].length;
    let imageWidth: number;
    let imageHeight: number;
    if (numCols > numRows) {
      imageWidth = props.length !== undefined ? props.length : IMAGE_LENGTH;
      if (props.width !== undefined) {
        imageHeight = props.width;
      } else {
        imageHeight = Math.floor((imageWidth * numRows) / numCols);
        if (props.setWidth) {
          props.setWidth(imageHeight);
        }
      }
    } else {
      imageHeight = props.length !== undefined ? props.length : IMAGE_LENGTH;
      if (props.width !== undefined) {
        imageWidth = props.width;
      } else {
        imageWidth = Math.floor((imageHeight * numCols) / numRows);
        if (props.setWidth) {
          props.setWidth(imageHeight);
        }
      }
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
    if (props.imageOnly) {
      setImageMargins(zeroMargins);
    } else {
      setImageMargins({
        l: IMAGE_L_MARGIN,
        r: IMAGE_R_MARGIN,
        t: IMAGE_T_MARGIN,
        b: IMAGE_B_MARGIN
      });
      setHybridXMargins({
        l: HYBRIDX_L_MARGIN,
        r: HYBRIDX_R_MARGIN,
        t: HYBRIDX_T_MARGIN,
        b: HYBRIDX_B_MARGIN
      });
      setHybridYMargins({
        l: HYBRIDY_L_MARGIN,
        r: HYBRIDY_R_MARGIN,
        t: HYBRIDY_T_MARGIN,
        b: HYBRIDY_B_MARGIN
      });
    }
  };

  const animatePlot = () => {
    requestID = requestAnimationFrame(animatePlot);

    if (running) {
      if (animationCounter === slowX) {
        animationCounter = 1;
        props.setFrameIndex(frameIndex);
        setReport(playbackData[frameIndex]);
        if (frameIndex + 1 >= numFrames) {
          props.setRun(false);
        } else {
          frameIndex += 1;
        }
      } else {
        animationCounter++;
      }
    }
  };

  useEffect(() => {
    animationCounter = 1;
    slowX = SLOW_X - props.speed;
    slowX = slowX * 2 + 1;
  }, [props.speed]);

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
  }, [props.length, props.width, props.dataCounter]);

  useEffect(() => {
    const initialize = () => {
      setWidthHeight();
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
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", flexWrap: "nowrap" }}>
        {!props.imageOnly && (
          <HybridYPlot
            height={imageHeight}
            margins={hybridYMargins}
            swapXY={swapXY}
            report={report}
          />
        )}
        <ImagePlot
          width={imageWidth}
          height={imageHeight}
          margins={imageMargins}
          swapXY={swapXY}
          flip={props.flip}
          zMin={props.zMin}
          zMax={props.zMax}
          showScale={!props.imageOnly}
          report={report}
        />
      </div>
      {!props.imageOnly && (
        <HybridXPlot
          width={imageWidth}
          margins={hybridXMargins}
          swapXY={swapXY}
          report={report}
        />
      )}
    </div>
  ) : null;
};

export default ADCPlayback;
