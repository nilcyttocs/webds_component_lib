import React, { useContext, useEffect, useState } from "react";

import TouchPlot from "../touch_plots/TouchPlot";

import { TouchcommTouchReport, TouchcommTraceReport } from "@webds/service";

import { TouchDataContext, TraceDataContext } from "../local_exports";

const SLOW_X = 3;

let touchData: TouchcommTouchReport[];

let traceData: TouchcommTraceReport[];

let running: boolean;

let frameIndex: number;

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

  touchData = useContext(TouchDataContext);
  traceData = useContext(TraceDataContext);

  const animatePlot = () => {
    requestID = requestAnimationFrame(animatePlot);

    if (running) {
      if (animationCounter === SLOW_X) {
        animationCounter = 1;
        props.setFrameIndex(frameIndex);
        setReport(
          props.traceView ? traceData[frameIndex] : touchData[frameIndex]
        );
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
      setReport(
        props.traceView ? traceData[frameIndex] : touchData[frameIndex]
      );
    }
  }, [props.frameIndex, props.traceView]);

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
      <TouchPlot
        length={props.length}
        portrait={props.portrait}
        appInfo={props.appInfo}
        traceView={props.traceView}
        report={report}
      />
    </div>
  ) : null;
};

export default PlaybackTouch;
