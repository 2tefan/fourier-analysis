google.charts.load("current", { packages: ["corechart"] });

number = 11;
T1 = 100 + 5 * number; // s
T2 = T1 * 10;

Vs = 0.8 + number / 100;
targetValue = 10 + number;

function getDefaultOptions(title) {
  return {
    title: title,
    curveType: "function",
    legend: { position: "bottom" },
    hAxis: {
      title: "Time [ms]",
      gridlines: { interval: [1, 2, 5], count: 8 },
      minorGridlines: { interval: 0.5 },
    },
    vAxis: {
      title: "Voltage [V]",
      gridlines: { interval: [1, 2, 5], count: 8 },
    },
  };
}

function getDefaultOptionsDAC(title) {
  let options = getDefaultOptions(title);
  options.curveType = "none";
  options.vAxis.title = "Value";
  return options;
}

function drawPoint(name, arr, time, pos = 3) {
  arr[time][pos] = name + " [" + time + "/" + formatFloat(arr[time][1]) + "]";
}

function formatFloat(f1) {
  return Math.round(f1 * 100) / 100;
}

function addPoint(arr, Ua, name, i, posInArr) {
  arr[i - 1][posInArr] = Ua;
  drawPoint(name, arr, i - 1, posInArr + 1);
}

function addOvershoot(name, Uamax, Ua) {
  $(name).text(formatFloat((Uamax / Ua - 1) * 100) + " %");
}

function getKp() {
  return ((T2 / T1) * Math.sqrt(2)) / (2 * Vs);
}
