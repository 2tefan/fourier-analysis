google.charts.load("current", { packages: ["corechart"] });

number = 11;

Tin = 20 + 2 * number; // ms
signalHeight = 5 + number;
Tmeasuring = 10 * Tin; // ms
Tresolution = 1 / Tmeasuring; // kHz

samplingInterval = 1; // ms
numberOfHarmonics = 100;

function getDefaultOptions(titleX) {
  return {
    aspectRatio: 5,
    radius: 0,
    scales: {
      x: {
        title: {
          display: true,
          text: titleX,
        },
      },
      y: {
        title: {
          display: true,
          text: "Spannung [V]",
        },
      },
    },
    plugins: {
      datalabels: {
        display: false,
      },
    },
  };
}

function getDefaultOptionsFourier(titleX) {
  let options = getDefaultOptions(titleX);

  options.scales.x.ticks = {
    callback: function (value, index, values) {
      return index % 2 ? null : value + " kHz";
    },
  };

  options.scales.y.max = signalHeight * 1.5;

  options.plugins.datalabels = {
    formatter: function (value, context) {
      return (
        formatFloat(context.chart.data.labels[context.dataIndex]) +
        " kHz\n" +
        formatFloat(value) +
        " V"
      );
    },
    align: "end",
    anchor: "end",
    backgroundColor: "#F2F2F2",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#1E2C53",
    padding: 4,
    offset: 20,
    color: "#1E2C53",
    display: function (context) {
      return context.dataset.data[context.dataIndex] > 1;
    },
  };
  return options;
}

function prepareAnnotations(options) {
  options.plugins.annotation = {
    annotations: {},
  };
}

function addAnnotationX(options, name, value, text) {
  options.plugins.annotation.annotations[name] = {
    type: "line",
    scaleID: "x",
    value: value,
    borderColor: "black",
    borderWidth: 5,
    label: {
      backgroundColor: "red",
      content: text,
      enabled: true,
    },
  };
}

function getData(label, values) {
  return {
    labels: label,
    datasets: [
      {
        label: "Vout",
        data: values,
        borderColor: "rgb(75, 192, 192)",
        tension: 0,
      },
    ],
  };
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
