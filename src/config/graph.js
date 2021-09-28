const graphConfig = {
  afterBuildTicks: function (chartObj) {
    chartObj.ticks = [];
    chartObj.ticks.push(0.001);
    chartObj.ticks.push(0.005);
    chartObj.ticks.push(0.01);
    chartObj.ticks.push(0.05);
    chartObj.ticks.push(0.1);
    chartObj.ticks.push(0.5);
    chartObj.ticks.push(1);
    chartObj.ticks.push(5);
    chartObj.ticks.push(10);
    chartObj.ticks.push(50);
    chartObj.ticks.push(100);
    chartObj.ticks.push(500);
    chartObj.ticks.push(1000);
  },
};

export default graphConfig;
