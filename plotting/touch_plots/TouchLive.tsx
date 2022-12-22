import React, { useEffect, useState } from "react";

import TouchPlot from "./TouchPlot";

import { TouchcommTouchReport, TouchcommTraceReport } from "@webds/service";

import { requestAPI } from "../local_exports";

const SSE_CLOSED = 2;
const REPORT_FPS = 120;
const RENDER_FPS = 30;

const REPORT_TOUCH = 17;

const RECORDED_DATA_FILE_NAME = "touch_data.json";

const IMAGE_LENGTH = 550;

let renderInterval = 1000 / RENDER_FPS;

let running: boolean;
let recording: boolean;
let saving: boolean;

let viewType: string;
let touchReport: TouchcommTouchReport;
let traceReport: TouchcommTraceReport;
let recordedData: TouchcommTouchReport[] = [];

let traceStats: number[][];
let traceStatus: string[];

let eventSource: EventSource | undefined;
let eventError: boolean;
let requestID: number | undefined;

let tThen: number;

const saveRecordedData = () => {
  saving = true;
  let blob = new Blob([JSON.stringify({ data: recordedData })], {
    type: "application/json"
  });
  recordedData = [];
  saving = false;
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = RECORDED_DATA_FILE_NAME;
  link.click();
};

const computeLinearity = (index: number, length: number): number => {
  const xSum = traceReport.xTrace[index].reduce((a, b) => a + b, 0);
  const xSumSquared = xSum * xSum;
  const xMean = xSum / length;
  const xSquared = traceReport.xTrace[index].map((e) => e * e);
  const xSquaredSum = xSquared.reduce((a, b) => a + b, 0);

  const ySum = traceReport.yTrace[index].reduce((a, b) => a + b, 0);
  const yMean = ySum / length;

  const xySum = traceReport.xTrace[index].reduce(
    (a, b, i) => a + b * traceReport.yTrace[index][i],
    0
  );

  /* Coefficients for equation of line best fit (Ax + By + C = 0) */
  const A =
    (xySum - (xSum * ySum) / length) / (xSquaredSum - xSumSquared / length);
  const B = -1;
  const C = yMean - A * xMean;

  let linearity = 0;
  const denominator = Math.sqrt(A * A + B * B);

  for (let i = 0; i < length; i++) {
    const distance =
      Math.abs(
        A * traceReport.xTrace[index][i] + B * traceReport.yTrace[index][i] + C
      ) / denominator;
    linearity = distance > linearity ? distance : linearity;
  }

  linearity = Math.round(linearity * 1e1) / 1e1;

  return linearity;
};

const captureTraces = () => {
  let pos = touchReport[1].pos;
  if (pos === undefined) {
    pos = [];
  }

  for (let i = 0; i < 10; i++) {
    if (traceStatus[i] === "+") {
      traceStatus[i] = "-";
    }
  }

  for (let i = 0; i < pos.length; i++) {
    const obj = pos[i];
    const index = obj.objectIndex;

    if (traceStatus[index] === "*") {
      traceReport.xTrace[index] = [obj.xMeas];
      traceReport.yTrace[index] = [obj.yMeas];
      traceStats[index] = Array(7);
    } else {
      traceReport.xTrace[index].push(obj.xMeas);
      traceReport.yTrace[index].push(obj.yMeas);
    }
    traceStatus[index] = "+";

    if (
      traceStats[index][0] === undefined ||
      obj.xMeas < traceStats[index][0]!
    ) {
      traceStats[index][0] = obj.xMeas;
    }
    if (
      traceStats[index][1] === undefined ||
      obj.xMeas > traceStats[index][1]!
    ) {
      traceStats[index][1] = obj.xMeas;
    }
    if (
      traceStats[index][2] === undefined ||
      obj.yMeas < traceStats[index][2]!
    ) {
      traceStats[index][2] = obj.yMeas;
    }
    if (
      traceStats[index][3] === undefined ||
      obj.yMeas > traceStats[index][3]!
    ) {
      traceStats[index][3] = obj.yMeas;
    }
  }

  for (let i = 0; i < 10; i++) {
    if (traceStatus[i] === "-") {
      traceStatus[i] = "*";
      if (traceStats[i][0] !== undefined && traceStats[i][1] !== undefined) {
        traceStats[i][4] = traceStats[i][1]! - traceStats[i][0]!;
      }
      if (traceStats[i][2] !== undefined && traceStats[i][3] !== undefined) {
        traceStats[i][5] = traceStats[i][3]! - traceStats[i][2]!;
      }
      traceStats[i][6] = computeLinearity(i, traceReport.xTrace[i].length);
    }
  }
};

const parseTouchStats = (props: any): number[][] => {
  const stats = [...Array(10)].map((e) => Array(5));
  const x = [...Array(10)].map((e) => Array(1));
  const y = [...Array(10)].map((e) => Array(1));
  for (let i = 0; i < touchReport[1].pos!.length; i++) {
    const obj = touchReport[1].pos![i];
    const index = obj.objectIndex;
    let xMeas = props.flip?.v ? props.appInfo.maxX - obj.xMeas : obj.xMeas;
    let yMeas = props.flip?.h ? props.appInfo.maxY - obj.yMeas : obj.yMeas;
    x[index][0] = props.swapXY ? yMeas : xMeas;
    y[index][0] = props.swapXY ? xMeas : yMeas;
    stats[index][0] = obj.xMeas;
    stats[index][1] = obj.yMeas;
    stats[index][2] = obj.z;
    stats[index][3] = obj.xWidth;
    stats[index][4] = obj.yWidth;
  }
  return stats;
};

const eventHandler = (event: any) => {
  const data = JSON.parse(event.data);
  if (!data || !data.report || data.report[0] !== "position") {
    return;
  }

  if (recording) {
    recordedData.push(data.report);
  } else {
    if (recordedData.length > 0 && !saving) {
      saveRecordedData();
      return;
    }
  }

  touchReport = data.report;

  if (touchReport[1].pos === undefined) {
    touchReport[1].pos = [];
  }
};

const errorHandler = (error: any) => {
  eventError = true;
  console.error(`Error on GET /webds/report\n${error}`);
};

const removeEvent = () => {
  if (eventSource && eventSource.readyState !== SSE_CLOSED) {
    eventSource.removeEventListener("report", eventHandler, false);
    eventSource.removeEventListener("error", errorHandler, false);
    eventSource.close();
    eventSource = undefined;
  }
};

const addEvent = () => {
  if (eventSource) {
    return;
  }
  eventError = false;
  eventSource = new window.EventSource("/webds/report");
  eventSource.addEventListener("report", eventHandler, false);
  eventSource.addEventListener("error", errorHandler, false);
};

const setReportTypes = async (
  enable: number[],
  disable: number[]
): Promise<void> => {
  const dataToSend = { enable, disable, fps: REPORT_FPS };
  try {
    await requestAPI<any>("report", {
      body: JSON.stringify(dataToSend),
      method: "POST"
    });
  } catch (error) {
    console.error(`Error - POST /webds/report\n${error}`);
    return Promise.reject("Failed to enable/disable report types");
  }
  return Promise.resolve();
};

const enableReport = async (enable: boolean) => {
  if (viewType === undefined) {
    return;
  }
  try {
    await setReportTypes(
      enable ? [REPORT_TOUCH] : [],
      enable ? [] : [REPORT_TOUCH]
    );
    if (enable) {
      addEvent();
    }
  } catch (error) {
    console.error(error);
    return Promise.reject();
  }
};

const stopAnimation = () => {
  if (requestID) {
    cancelAnimationFrame(requestID);
    requestID = undefined;
  }
};

export const TouchLive = (props: any): JSX.Element | null => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [showPlot, setShowPlot] = useState<boolean>(false);
  const [report, setReport] = useState<
    TouchcommTouchReport[1] | TouchcommTraceReport
  >();
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);
  const [swapXY, setSwapXY] = useState<boolean>(false);

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

  const clearPlot = () => {
    touchReport = ["position", { pos: [] }];
    traceReport = {
      xTrace: [...Array(10)].map((e) => Array(1)),
      yTrace: [...Array(10)].map((e) => Array(1))
    };
    traceStats = [...Array(10)].map((e) => Array(7));
    traceStatus = [...Array(10)].map((e) => "*");
    setReport(viewType === "position" ? touchReport[1] : traceReport);
  };

  const animatePlot = () => {
    if (eventError) {
      removeEvent();
      requestID = undefined;
      clearPlot();
      enableReport(true);
      requestID = requestAnimationFrame(animatePlot);
      return;
    }

    requestID = requestAnimationFrame(animatePlot);

    if (!running) {
      return;
    }

    const tNow = window.performance.now();
    const elapsed = tNow - tThen;
    if (elapsed <= renderInterval) {
      return;
    }
    tThen = tNow - (elapsed % renderInterval);

    if (!initialized) {
      setWidthHeight();
      setInitialized(true);
    }

    if (touchReport === undefined) {
      return;
    }

    let stats: number[][];
    if (viewType === "position") {
      stats = parseTouchStats(props);
    } else {
      captureTraces();
      stats = [...Array(10)].map((e) => Array(5));
      for (let i = 0; i < 10; i++) {
        stats[i] = traceStats[i].slice(4);
      }
    }

    setReport(viewType === "position" ? touchReport[1] : traceReport);
    if (props.updateStats) {
      props.updateStats(stats);
    }

    setShowPlot(true);
    if (props.setPlotReady) {
      props.setPlotReady(true);
    }
  };

  const startAnimation = () => {
    tThen = window.performance.now();
    requestID = requestAnimationFrame(animatePlot);
  };

  const newPlot = async () => {
    if (viewType === undefined) {
      return;
    }
    try {
      await enableReport(true);
    } catch (error) {
      console.error(error);
      return;
    }
    startAnimation();
  };

  useEffect(() => {
    if (props.renderRate !== undefined) {
      renderInterval = 1000 / props.renderRate;
    }
  }, [props.renderRate]);

  useEffect(() => {
    clearPlot();
  }, [props.clearPlot]);

  useEffect(() => {
    setWidthHeight();
  }, [props.length, props.width]);

  useEffect(() => {
    recording = props.record;
  }, [props.record]);

  useEffect(() => {
    running = !props.halt;
    enableReport(running);
    if (props.halt) {
      removeEvent();
    }
  }, [props.halt]);

  useEffect(() => {
    running = props.run;
  }, [props.run]);

  useEffect(() => {
    viewType = props.viewType;
    running = viewType === "position" ? props.run : true;
    clearPlot();
  }, [props.viewType]);

  useEffect(() => {
    viewType = props.viewType;
    clearPlot();
    newPlot();
    return () => {
      enableReport(false);
      stopAnimation();
      removeEvent();
    };
  }, []);

  return showPlot ? (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <TouchPlot
        width={imageWidth}
        height={imageHeight}
        swapXY={swapXY}
        flip={props.flip}
        appInfo={props.appInfo}
        traceView={props.viewType === "trace"}
        report={report}
      />
    </div>
  ) : null;
};

export default TouchLive;
