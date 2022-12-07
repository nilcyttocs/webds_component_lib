import React, { useContext, useEffect, useState } from "react";

import TouchPlot from "../touch_plots/TouchPlot";

import { TouchcommTouchReport, TouchcommTraceReport } from "@webds/service";

import { TouchDataContext, TraceDataContext } from "../local_exports";

const SLOW_X = 3;

const IMAGE_LENGTH = 550;

let touchData: TouchcommTouchReport[];

let traceData: TouchcommTraceReport[];

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

export const PlaybackTouch = (props: any): JSX.Element | null => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [report, setReport] = useState<
    TouchcommTouchReport | TouchcommTraceReport
  >();
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);
  const [swapXY, setSwapXY] = useState<boolean>(false);

  touchData = useContext(TouchDataContext);
  traceData = useContext(TraceDataContext);

  const setWidthHeight = () => {
    let imageWidth: number;
    let imageHeight: number;
    if (props.appInfo.maxX > props.appInfo.maxY) {
      imageWidth = props.length !== undefined ? props.length : IMAGE_LENGTH;
      imageHeight = Math.floor(
        (imageWidth * (props.appInfo.maxY + 1)) / (props.appInfo.maxX + 1)
      );
    } else {
      imageHeight = props.length !== undefined ? props.length : IMAGE_LENGTH;
      imageWidth = Math.floor(
        (imageHeight * (props.appInfo.maxX + 1)) / (props.appInfo.maxY + 1)
      );
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
        setReport(
          props.traceView ? traceData[frameIndex] : touchData[frameIndex]
        );
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
      setReport(
        props.traceView ? traceData[frameIndex] : touchData[frameIndex]
      );
    }
  }, [props.frameIndex, props.traceView, touchData, traceData]);

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
      <TouchPlot
        width={imageWidth}
        height={imageHeight}
        swapXY={swapXY}
        flip={props.flip}
        appInfo={props.appInfo}
        traceView={props.traceView}
        report={report}
      />
    </div>
  ) : null;
};

export default PlaybackTouch;
