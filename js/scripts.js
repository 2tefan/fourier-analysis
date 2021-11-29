google.charts.load("current", { packages: ["corechart"] });

number = 11;

Tin = 20 + 2 * number; // ms
signalHeight = 5 + number;
Tmeasuring = 10 * Tin; // ms
Tresolution = 1 / Tmeasuring; // kHz

samplingInterval = 1; // ms
numberOfHarmonics = 100;

function getDefaultOptions() {
  return {
    aspectRatio: 5,
    radius: 0,
    scales: {
      x: {
        title: {
          display: true,
          text: "Zeit [ms]",
        },
      },
      y: {
        title: {
          display: true,
          text: "Spannung [V]",
        },
      },
    },
  };
}

function getDefaultOptionsCurveTypeNone(title) {
  let options = getDefaultOptions(title);
  options.curveType = "none";
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
