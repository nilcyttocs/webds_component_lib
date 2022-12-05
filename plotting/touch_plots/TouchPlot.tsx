import React, { useEffect, useState } from "react";

import { VIRIDIS_COLORS } from "./constants";

import { TouchcommTouchReport, TouchcommTraceReport } from "@webds/service";

import Plot from "react-plotly.js";

const PLOT_LENGTH = 550;

let plotWidth: number;
let plotHeight: number;
let plotMargins = {
  l: 1,
  r: 1,
  t: 1,
  b: 1
};

let swap: boolean;

const plotConfig = { displayModeBar: false };
const plotBgColor = "black";
const paperBgColor = "rgba(0, 0, 0, 0)";
const axisLineColor = "rgba(128, 128, 128, 0.5)";

export const TouchPlot = (props: any): JSX.Element | null => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [showPlot, setShowPlot] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [config, setConfig] = useState<any>({});
  const [layout, setLayout] = useState<any>({});
  const [frames, setFrames] = useState<any>([]);

  const storeState = (figure: any) => {
    setData(figure.data);
    setLayout(figure.layout);
    setFrames(figure.frames);
    setConfig(figure.config);
  };

  const generateTraces = (xTrace: number[][], yTrace: number[][]): any => {
    const traces = [];

    for (let i = 0; i < 10; i++) {
      const trace = {
        x: xTrace[i],
        y: yTrace[i],
        mode: "lines",
        line: { shape: "linear", width: 5, color: VIRIDIS_COLORS[i] },
        name: "Object " + i,
        hovertemplate: "(%{x}, %{y})<extra></extra>"
      };
      traces.push(trace);
    }

    const dummyX: number[] = [];
    const dummyY: number[] = [];
    traces.push({ x: dummyX, y: dummyY });
    return traces;
  };

  const renderTraces = (report: TouchcommTraceReport) => {
    if (report.xTrace === undefined || report.yTrace === undefined) {
      return;
    }

    let traceX: number[][] = [];
    let traceY: number[][] = [];
    for (let i = 0; i < 10; i++) {
      traceX.push(report.xTrace[i].slice());
      traceY.push(report.yTrace[i].slice());
      if (props.flip?.v) {
        traceX[i] = traceX[i].map((item) => props.appInfo.maxX - item);
      }
      if (props.flip?.h) {
        traceY[i] = traceY[i].map((item) => props.appInfo.maxY - item);
      }
    }
    const xTrace = swap ? traceY : traceX;
    const yTrace = swap ? traceX : traceY;

    setData(generateTraces(xTrace, yTrace));
    setShowPlot(true);
  };

  const generateMarkers = (x: number[][], y: number[][]): any => {
    const markers = [];

    for (let i = 0; i < 10; i++) {
      const marker = {
        x: x[i],
        y: y[i],
        mode: "markers+text",
        marker: { size: 32, color: VIRIDIS_COLORS[i] },
        text: [i.toString()],
        textposition: "inside",
        textfont: { family: "Arial", color: "white", size: 16 },
        name: "Object " + i,
        hovertemplate: "(%{x}, %{y})<extra></extra>"
      };
      if (i >= 5) {
        marker.textfont.color = "black";
      }
      markers.push(marker);
    }

    return markers;
  };

  const renderMarkers = (report: TouchcommTouchReport) => {
    let pos = report.pos;
    if (pos === undefined) {
      pos = [];
    }

    const stats = [...Array(10)].map((e) => Array(5));
    const x = [...Array(10)].map((e) => Array(1));
    const y = [...Array(10)].map((e) => Array(1));
    for (let i = 0; i < pos.length; i++) {
      const obj = pos[i];
      const index = obj.objectIndex;
      let xMeas = props.flip?.v ? props.appInfo.maxX - obj.xMeas : obj.xMeas;
      let yMeas = props.flip?.h ? props.appInfo.maxY - obj.yMeas : obj.yMeas;
      x[index][0] = swap ? yMeas : xMeas;
      y[index][0] = swap ? xMeas : yMeas;
      stats[index][0] = obj.xMeas;
      stats[index][1] = obj.yMeas;
      stats[index][2] = obj.z;
      stats[index][3] = obj.xWidth;
      stats[index][4] = obj.yWidth;
    }

    setData(generateMarkers(x, y));

    if (props.updateStats !== undefined) {
      props.updateStats(stats);
    }

    setShowPlot(true);
  };

  useEffect(() => {
    if (props.report === undefined) {
      return;
    }
    if (!initialized) {
      if (props.appInfo.maxX > props.appInfo.maxY) {
        plotWidth = props.length !== undefined ? props.length : PLOT_LENGTH;
        plotHeight = Math.floor(
          (plotWidth * (props.appInfo.maxY + 1)) / (props.appInfo.maxX + 1)
        );
      } else {
        plotHeight = props.length !== undefined ? props.length : PLOT_LENGTH;
        plotWidth = Math.floor(
          (plotWidth * (props.appInfo.maxX + 1)) / (props.appInfo.maxY + 1)
        );
      }
      swap = props.portrait && plotWidth > plotHeight;
      setConfig(plotConfig);
      setLayout({
        width: swap ? plotHeight : plotWidth,
        height: swap ? plotWidth : plotHeight,
        margin: plotMargins,
        plot_bgcolor: plotBgColor,
        paper_bgcolor: paperBgColor,
        xaxis: {
          range: [0, swap ? props.appInfo.maxY : props.appInfo.maxX],
          mirror: true,
          showline: true,
          linecolor: axisLineColor,
          showticklabels: false
        },
        yaxis: {
          range: [0, swap ? props.appInfo.maxX : props.appInfo.maxY],
          mirror: true,
          showline: true,
          linecolor: axisLineColor,
          showticklabels: false
        },
        showlegend: false
      });
      setInitialized(true);
    }
    if (props.traceView) {
      renderTraces(props.report);
    } else {
      renderMarkers(props.report);
    }
  }, [props.report, props.flip, props.traceView]);

  return showPlot ? (
    <Plot
      data={data}
      layout={layout}
      frames={frames}
      config={config}
      onInitialized={(figure) => storeState(figure)}
      onUpdate={(figure) => storeState(figure)}
    />
  ) : null;
};

export default TouchPlot;