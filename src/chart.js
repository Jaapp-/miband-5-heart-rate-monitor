import ApexCharts from 'apexcharts';

const DATAPOINTS = 30;

export class Chart {
  constructor(selector) {
    this.data = [];
    // for (let i = 0; i < DATAPOINTS; i++) {
    //   this.data.push({
    //     x: new Date().getTime() + 1000 * (i - DATAPOINTS),
    //     y: Math.floor(Math.random() * 100)
    //   })
    // }
    const options = {
      chart: {
        type: 'area',
        height: '100%',
        animations: {
          enabled: false,
        },
        sparkline: {
          enabled: true
        }
      },
      colors: ['#ff143d'],
      stroke: {
        curve: 'smooth'
      },
      tooltip: {
        enabled: false
      },
      series: [{
        data: this.data.slice()
      }],
    }
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
      y: value
    });
    this.chart.updateSeries([
      {
        data: this.data
      }
    ]);
  }
}

window.Chart = Chart;

