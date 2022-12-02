import React, { useEffect, useState } from "react";

import { useTheme } from "@mui/material/styles";

import { TouchcommADCReport } from "@webds/service";

import Plot from "react-plotly.js";

const PLOT_WIDTH = 60;
const PLOT_HEIGHT = 250;

let plotWidth = PLOT_WIDTH;
let plotHeight = PLOT_HEIGHT;
let plotMargins = {
  l: 0,
  r: 0,
  t: 0,
  b: 0
};

let barY: number[] | undefined;
let barYMin: number | undefined;
let barYMax: number | undefined;

const plotConfig = { displayModeBar: false };
const plotBgColor = "rgba(0.75, 0.75, 0.75, 0.1)";
const paperBgColor = "rgba(0, 0, 0, 0)";
const axisLineColor = "rgba(128, 128, 128, 0.5)";

const computePlot = (report: TouchcommADCReport) => {
  barY = report.hybridy;

  if (barY === undefined) {
    return;
  }

  barYMin = Math.min.apply(Math, barY);
  barYMax = Math.max.apply(Math, barY);
};

export const HybridYPlot = (props: any): JSX.Element | null => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [showPlot, setShowPlot] = useState<boolean>(false);
  const [barYData, setBarYData] = useState<any>([]);
  const [barYConfig, setBarYConfig] = useState<any>({});
  const [barYLayout, setBarYLayout] = useState<any>({});
  const [barYFrames, setBarYFrames] = useState<any>([]);

  const theme = useTheme();

  const storeBarYState = (figure: any) => {
    setBarYData(figure.data);
    setBarYConfig(figure.config);
    setBarYLayout(figure.layout);
    setBarYFrames(figure.frames);
  };

  const renderPlot = (report: TouchcommADCReport) => {
    computePlot(report);

    if (barY === undefined) {
      return;
    }

    setBarYLayout({
      width: plotWidth + plotMargins.l + plotMargins.r,
      height: plotHeight + plotMargins.t + plotMargins.b,
      margin: plotMargins,
      font: {
        color: theme.palette.text.primary
      },
      plot_bgcolor: plotBgColor,
      paper_bgcolor: paperBgColor,
      xaxis: {
        side: "top",
        mirror: true,
        showline: true,
        showgrid: false,
        ticks: "",
        tickformat: ">-d",
        tickmode: "array",
        tickvals: [barYMin, barYMax],
        range: [barYMin, barYMax],
        linecolor: axisLineColor,
        zerolinecolor: axisLineColor
      },
      yaxis: {
        mirror: true,
        showline: true,
        showgrid: false,
        ticks: "",
        tickformat: ">-d",
        tickmode: "array",
        tickvals: [],
        linecolor: axisLineColor
      }
    });
    setBarYData([
      {
        x: barY,
        type: "bar",
        width: 0.5
      }
    ]);

    setShowPlot(true);
  };

  useEffect(() => {
    if (props.report === undefined) {
      return;
    }
    if (!initialized) {
      plotWidth = props.width !== undefined ? props.width : plotWidth;
      plotHeight = props.height !== undefined ? props.height : plotHeight;
      plotMargins = props.margins !== undefined ? props.margins : plotMargins;
      setBarYConfig(plotConfig);
      setInitialized(true);
    }
    renderPlot(props.report);
    return () => {
      barY = undefined;
      barYMin = undefined;
      barYMax = undefined;
    };
  }, [props.report]);

  return showPlot ? (
    <Plot
      data={barYData}
      config={barYConfig}
      layout={barYLayout}
      frames={barYFrames}
      onInitialized={(figure) => storeBarYState(figure)}
      onUpdate={(figure) => storeBarYState(figure)}
    />
  ) : null;
};

export default HybridYPlot;
