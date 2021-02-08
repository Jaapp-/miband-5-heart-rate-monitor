import ApexCharts from "apexcharts";

const DATAPOINTS = 30;

export class Chart {
  constructor(selector) {
    this.data = [];
    const options = {
      chart: {
        type: "area",
        height: "100%",
        animations: {
          enabled: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      colors: ["#ff143d"],
      stroke: {
        curve: "smooth",
      },
      tooltip: {
        enabled: false,
      },
      yaxis: {
        min: 0,
        max: 160,
      },
      series: [
        {
          data: this.data.slice(),
        },
      ],
    };
    /** @type ApexCharts */
    this.chart = new ApexCharts(document.querySelector(selector), options);
    this.chart.render();
  }

  update(value) {
    if (this.data.length >= DATAPOINTS) {
      this.data.splice(0, 1);
    }
    this.data.push({
      x: new Date().getTime(),
      y: value,
    });
    this.chart.updateSeries([
      {
        data: this.data,
      },
    ]);
  }
}

window.Chart = Chart;
