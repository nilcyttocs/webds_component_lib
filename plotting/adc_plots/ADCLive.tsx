import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";

import ImagePlot from "../adc_plots/ImagePlot";
import HybridXPlot from "../adc_plots/HybridXPlot";
import HybridYPlot from "../adc_plots/HybridYPlot";

import { TouchcommADCReport } from "@webds/service";

import { requestAPI } from "../local_exports";

const SSE_CLOSED = 2;
const REPORT_FPS = 120;
const RENDER_FPS = 15;
const RENDER_INTERVAL = 1000 / RENDER_FPS;

const REPORT_TOUCH = 17;
const REPORT_DELTA = 18;
const REPORT_RAW = 19;
const REPORT_BASELINE = 20;

const RECORDED_DATA_FILE_NAME = "adc_data.json";

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

let running: boolean;
let recording: boolean;
let saving: boolean;

let reportType: number;
let originalReport: TouchcommADCReport;
let computedReport: TouchcommADCReport | undefined;
let recordedData: TouchcommADCReport[] = [];

let eventSource: EventSource | undefined;
let eventError: boolean;
let eventCount: number;
let requestID: number | undefined;

let t0: number;
let t1: number;
let t00: number;
let t11: number;
let tThen: number;
let fps: number;

const bufferSize = 1000;
let buffer: TouchcommADCReport[];
let subBuffer: TouchcommADCReport[] | undefined;
let statistics: string;
let samples: number;
let index: number;
let filled: boolean;

let numRows: number;
let numCols: number;

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

const updateSubBuffer = () => {
  const end = index;
  const start = index - samples;
  if (start < 0) {
    subBuffer = [...buffer.slice(start), ...buffer.slice(0, end)];
  } else {
    subBuffer = buffer.slice(start, end);
  }
};

const eventHandler = (event: any) => {
  const data = JSON.parse(event.data);
  if (!data || !data.report) {
    return;
  }

  if (
    (reportType === REPORT_DELTA && data.report[0] === "delta") ||
    (reportType === REPORT_RAW && data.report[0] === "raw") ||
    (reportType === REPORT_BASELINE && data.report[0] === "baseline")
  ) {
    originalReport = data.report[1];
  } else {
    return;
  }

  if (
    originalReport.image === undefined ||
    originalReport.hybridx === undefined ||
    originalReport.hybridy === undefined ||
    buffer === undefined
  ) {
    return;
  }

  if (recording) {
    recordedData.push(originalReport);
  } else {
    if (recordedData.length > 0 && !saving) {
      saveRecordedData();
      return;
    }
  }

  eventCount++;
  t11 = Date.now();
  if (t11 - t00 >= 1000) {
    t00 = t11;
    fps = eventCount;
    eventCount = 0;
  }

  index = (index + 1) % bufferSize;
  buffer[index] = {
    image: originalReport.image,
    hybridx: originalReport.hybridx,
    hybridy: originalReport.hybridy
  };

  if (!filled) {
    if (index + 1 >= samples) {
      updateSubBuffer();
    } else {
      subBuffer = undefined;
    }
    if (index + 1 === bufferSize) {
      filled = true;
    }
  } else {
    updateSubBuffer();
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
    addEvent();
  } catch (error) {
    console.error(`Error - POST /webds/report\n${error}`);
    return Promise.reject("Failed to enable/disable report types");
  }
  return Promise.resolve();
};

const getMean = (): TouchcommADCReport | undefined => {
  if (subBuffer === undefined) {
    return undefined;
  }
  try {
    const mean = subBuffer.reduce(
      function (mean, cur) {
        if (cur === undefined) {
          return mean;
        }
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            mean.image[i][j] += cur.image[i][j] / samples;
          }
        }
        for (let i = 0; i < numCols; i++) {
          mean.hybridx[i] += cur.hybridx[i] / samples;
        }
        for (let i = 0; i < numRows; i++) {
          mean.hybridy[i] += cur.hybridy[i] / samples;
        }
        return mean;
      },
      {
        image: [...Array(numRows)].map((e) => Array(numCols).fill(0)),
        hybridx: [...Array(numCols)].map((e) => 0),
        hybridy: [...Array(numRows)].map((e) => 0)
      }
    );
    return mean;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const getMax = (): TouchcommADCReport | undefined => {
  if (subBuffer === undefined) {
    return undefined;
  }
  try {
    const max = subBuffer.reduce(
      function (max, cur) {
        if (cur === undefined) {
          return max;
        }
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            max.image[i][j] =
              cur.image[i][j] > max.image[i][j]
                ? cur.image[i][j]
                : max.image[i][j];
          }
        }
        for (let i = 0; i < numCols; i++) {
          max.hybridx[i] =
            cur.hybridx[i] > max.hybridx[i] ? cur.hybridx[i] : max.hybridx[i];
        }
        for (let i = 0; i < numRows; i++) {
          max.hybridy[i] =
            cur.hybridy[i] > max.hybridy[i] ? cur.hybridy[i] : max.hybridy[i];
        }
        return max;
      },
      {
        image: [...Array(numRows)].map((e) => Array(numCols).fill(-Infinity)),
        hybridx: [...Array(numCols)].map((e) => -Infinity),
        hybridy: [...Array(numRows)].map((e) => -Infinity)
      }
    );
    return max;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const getMin = (): TouchcommADCReport | undefined => {
  if (subBuffer === undefined) {
    return undefined;
  }
  try {
    const min = subBuffer.reduce(
      function (min, cur) {
        if (cur === undefined) {
          return min;
        }
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            min.image[i][j] =
              cur.image[i][j] < min.image[i][j]
                ? cur.image[i][j]
                : min.image[i][j];
          }
        }
        for (let i = 0; i < numCols; i++) {
          min.hybridx[i] =
            cur.hybridx[i] < min.hybridx[i] ? cur.hybridx[i] : min.hybridx[i];
        }
        for (let i = 0; i < numRows; i++) {
          min.hybridy[i] =
            cur.hybridy[i] < min.hybridy[i] ? cur.hybridy[i] : min.hybridy[i];
        }
        return min;
      },
      {
        image: [...Array(numRows)].map((e) => Array(numCols).fill(Infinity)),
        hybridx: [...Array(numCols)].map((e) => Infinity),
        hybridy: [...Array(numRows)].map((e) => Infinity)
      }
    );
    return min;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const getRange = (): TouchcommADCReport | undefined => {
  if (subBuffer === undefined) {
    return undefined;
  }
  try {
    const max = getMax();
    const min = getMin();
    if (max === undefined || min === undefined) {
      return undefined;
    }
    const range = {
      image: [...Array(numRows)].map((e) => Array(numCols)),
      hybridx: [...Array(numCols)],
      hybridy: [...Array(numRows)]
    };
    range.image = max.image.map(function (rArray, rIndex) {
      return rArray.map(function (maxElement, cIndex) {
        return maxElement - min.image[rIndex][cIndex];
      });
    });
    range.hybridx = max.hybridx.map(function (maxElement, index) {
      return maxElement - min.hybridx[index];
    });
    range.hybridy = max.hybridy.map(function (maxElement, index) {
      return maxElement - min.hybridy[index];
    });
    return range;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const stopAnimation = () => {
  if (requestID) {
    cancelAnimationFrame(requestID);
    requestID = undefined;
  }
};

const computePlot = () => {
  if (buffer === undefined) {
    computedReport = undefined;
    return;
  }

  switch (statistics) {
    case "Single":
      computedReport = buffer[index];
      break;
    case "Mean":
      computedReport = getMean();
      break;
    case "Max":
      computedReport = getMax();
      break;
    case "Min":
      computedReport = getMin();
      break;
    case "Range":
      computedReport = getRange();
      break;
    default:
      computedReport = buffer[index];
      break;
  }
};

export const ADCLive = (props: any): JSX.Element | null => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [showPlot, setShowPlot] = useState<boolean>(false);
  const [report, setReport] = useState<TouchcommADCReport>();
  const [imageWidth, setImageWidth] = useState<number>(0);
  const [imageHeight, setImageHeight] = useState<number>(0);
  const [imageMargins, setImageMargins] = useState<Margins>(zeroMargins);
  const [hybridXMargins, setHybridXMargins] = useState<Margins>(zeroMargins);
  const [hybridYMargins, setHybridYMargins] = useState<Margins>(zeroMargins);
  const [swapXY, setSwapXY] = useState<boolean>(false);

  const setWidthHeight = () => {
    numRows = originalReport.image.length;
    numCols = originalReport.image[0].length;
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
    if (eventError) {
      removeEvent();
      requestID = undefined;
      setShowPlot(false);
      if (props.resetReportType) {
        props.resetReportType();
      }
      return;
    }

    requestID = requestAnimationFrame(animatePlot);

    if (!running) {
      return;
    }

    const tNow = window.performance.now();
    const elapsed = tNow - tThen;
    if (elapsed <= RENDER_INTERVAL) {
      return;
    }
    tThen = tNow - (elapsed % RENDER_INTERVAL);

    if (!initialized) {
      if (
        originalReport === undefined ||
        originalReport.image === undefined ||
        originalReport.hybridx === undefined ||
        originalReport.hybridy === undefined
      ) {
        return;
      }
      setWidthHeight();
      setInitialized(true);
    }

    computePlot();
    if (computedReport !== undefined) {
      t1 = Date.now();
      if (t1 - t0 >= 1000) {
        t0 = t1;
        if (props.updateSampleRate) {
          props.updateSampleRate(fps);
        }
      }
      setReport(computedReport);
      setShowPlot(true);
    }
  };

  const startAnimation = () => {
    t0 = Date.now();
    t00 = Date.now();
    eventCount = 0;
    buffer = new Array(bufferSize);
    filled = false;
    index = bufferSize - 1;
    subBuffer = undefined;
    requestID = requestAnimationFrame(animatePlot);
  };

  const newPlot = async () => {
    reportType = props.reportType;
    if (reportType === undefined) {
      return;
    }
    try {
      switch (reportType) {
        case REPORT_DELTA:
          await setReportTypes(
            [REPORT_DELTA],
            [REPORT_TOUCH, REPORT_RAW, REPORT_BASELINE]
          );
          break;
        case REPORT_RAW:
          await setReportTypes(
            [REPORT_RAW],
            [REPORT_TOUCH, REPORT_DELTA, REPORT_BASELINE]
          );
          break;
        case REPORT_BASELINE:
          await setReportTypes(
            [REPORT_BASELINE],
            [REPORT_TOUCH, REPORT_DELTA, REPORT_RAW]
          );
          break;
        default:
          throw new Error(`Invalid report type: ${reportType}`);
      }
    } catch (error) {
      console.error(error);
      if (props.resetReportType) {
        props.resetReportType();
      }
      return;
    }
    startAnimation();
  };

  useEffect(() => {
    statistics = props.statistics;
  }, [props.statistics]);

  useEffect(() => {
    samples = props.samples;
  }, [props.samples]);

  useEffect(() => {
    recording = props.record;
  }, [props.record]);

  useEffect(() => {
    running = props.run;
  }, [props.run]);

  useEffect(() => {
    newPlot();
    return () => {
      stopAnimation();
      removeEvent();
    };
  }, [props.reportType]);

  return showPlot ? (
    <div>
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

export default ADCLive;
