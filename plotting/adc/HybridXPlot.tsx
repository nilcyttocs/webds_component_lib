import React, { useEffect, useState } from "react";

import { useTheme } from "@mui/material/styles";

import { TouchcommReport } from "@webds/service";

import Plot from "react-plotly.js";

const PLOT_WIDTH = 550;
const PLOT_HEIGHT = 60;

let plotWidth = PLOT_WIDTH;
let plotHeight = PLOT_HEIGHT;
let plotMargins = {
  l: 0,
  r: 0,
  t: 0,
  b: 0
};

let barX: number[];
let barXMin: number;
let barXMax: number;

const plotConfig = { displayModeBar: false };
const plotBgColor = "rgba(0.75, 0.75, 0.75, 0.1)";
const paperBgColor = "rgba(0, 0, 0, 0)";
const axisLineColor = "rgba(128, 128, 128, 0.5)";

const computePlot = (report: TouchcommReport) => {
  barX = report.hybridx;

  if (barX === undefined) {
    return;
  }

  barXMin = Math.min.apply(Math, barX);
  barXMax = Math.max.apply(Math, barX);
};

export const HybridXPlot = (props: any): JSX.Element | null => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [showPlot, setShowPlot] = useState<boolean>(false);
  const [barXData, setBarXData] = useState<any>([]);
  const [barXConfig, setBarXConfig] = useState<any>({});
  const [barXLayout, setBarXLayout] = useState<any>({});
  const [barXFrames, setBarXFrames] = useState<any>([]);

  const theme = useTheme();

  const storeBarXState = (figure: any) => {
    setBarXData(figure.data);
    setBarXConfig(figure.config);
    setBarXLayout(figure.layout);
    setBarXFrames(figure.frames);
  };

  const renderPlot = (report: TouchcommReport) => {
    computePlot(report);

    if (barX === undefined) {
      return;
    }

    setBarXLayout({
      width: plotWidth + plotMargins.l + plotMargins.r,
      height: plotHeight + plotMargins.t + plotMargins.b,
      margin: plotMargins,
      font: {
        color: theme.palette.text.primary
      },
      plot_bgcolor: plotBgColor,
      paper_bgcolor: paperBgColor,
      xaxis: {
        mirror: true,
        showline: true,
        showgrid: false,
        ticks: "",
        tickformat: ">-d",
        tickmode: "array",
        tickvals: [],
        linecolor: axisLineColor
      },
      yaxis: {
        mirror: true,
        showline: true,
        showgrid: false,
        ticks: "",
        tickformat: ">-d",
        tickmode: "array",
        tickvals: [barXMin, barXMax],
        range: [barXMin, barXMax],
        linecolor: axisLineColor,
        zerolinecolor: axisLineColor
      }
    });

    setBarXData([
      {
        y: barX,
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
      setInitialized(true);
    }
    setBarXConfig(plotConfig);
    renderPlot(props.report);
  }, [props.report]);

  return showPlot ? (
    <Plot
      data={barXData}
      config={barXConfig}
      layout={barXLayout}
      frames={barXFrames}
      onInitialized={(figure) => storeBarXState(figure)}
      onUpdate={(figure) => storeBarXState(figure)}
    />
  ) : null;
};

export default HybridXPlot;
