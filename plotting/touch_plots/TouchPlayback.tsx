import React, { useContext, useEffect, useState } from "react";

import TouchPlot from "./TouchPlot";

import { TouchcommTouchReport, TouchcommTraceReport } from "@webds/service";

import { TouchDataContext, TraceDataContext } from "../local_exports";

const SLOW_X = 3;

const IMAGE_LENGTH = 550;

let touchData: TouchcommTouchReport[];

let traceData: TouchcommTraceReport[];

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

export const TouchPlayback = (props: any): JSX.Element | null => {
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
      if (props.width !== undefined) {
        imageHeight = props.width;
      } else {
        imageHeight = Math.floor(
          (imageWidth * (props.appInfo.maxY + 1)) / (props.appInfo.maxX + 1)
        );
        if (props.setWidth) {
          props.setWidth(imageHeight);
        }
      }
    } else {
      imageHeight = props.length !== undefined ? props.length : IMAGE_LENGTH;
      if (props.width !== undefined) {
        imageWidth = props.width;
      } else {
        imageWidth = Math.floor(
          (imageHeight * (props.appInfo.maxX + 1)) / (props.appInfo.maxY + 1)
        );
        if (props.setWidth) {
          props.setWidth(imageWidth);
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
  };

  const animatePlot = () => {
    requestID = requestAnimationFrame(animatePlot);

    if (running) {
      if (animationCounter === slowX) {
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

export default TouchPlayback;
