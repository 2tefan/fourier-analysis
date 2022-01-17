const number = 10;

const Tin = 20 + 2 * number; // ms
const signalHeight = 5 + number;
var Tmeasuring = 10 * Tin; // ms
var Tresolution = 1 / Tmeasuring; // kHz

const samplingInterval = 1; // ms
const numberOfHarmonics = 100;

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

function getDefaultOptionsFourier(titleX, ymax = signalHeight * 1.5) {
  let options = getDefaultOptions(titleX);

  options.scales.x.ticks = {
    callback: function (val, index) {
      return formatFloat(this.getLabelForValue(index)) + " kHz";
    },
  };

  options.scales.x.grid = {
    display: true,
    drawBorder: false,
    drawOnChartArea: true,
    drawTicks: true,
    tickLength: 10,
  };

  options.scales.y.max = ymax;

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

function fourier(ft, measuring = Tmeasuring) {
  let a = 0;
  let b = 0;
  let c = new Array(numberOfHarmonics);
  let phi = new Array(numberOfHarmonics);
  let position = new Array(numberOfHarmonics);

  for (k = 0; k < numberOfHarmonics; k++) {
    a = 0;
    b = 0;

    for (t = 0; t < measuring; t += samplingInterval) {
      a +=
        (2 / measuring) * ft[t] * Math.cos(2 * Math.PI * k * t * Tresolution);
      b +=
        (2 / measuring) * ft[t] * Math.sin(2 * Math.PI * k * t * Tresolution);
    }
    c[k] = Math.sqrt(a * a + b * b);
    phi[k] = Math.atan(a / b);
    position[k] = k * Tresolution * 1000;
  }
  c[0] = c[0] / 2;

  return [c, phi, position];
}

function reconstructedSignal(c, phi) {
  let label = new Array(Tmeasuring);
  let signal = new Array(Tmeasuring);

  for (t = 0; t < Tmeasuring; t += samplingInterval) {
    label[t] = t;
    signal[t] = 0;

    for (k = 0; k < numberOfHarmonics; k++) {
      signal[t] += c[k] * Math.sin(k * 2 * Math.PI * t * Tresolution + phi[k]);
    }
  }

  return [label, signal];
}

function getRectSignal(ratio = 2) {
  let arr = new Array(Tmeasuring);

  for (t = 0; t < Tmeasuring; t += samplingInterval) {
    if (t % Tin < Tin / ratio) {
      arr[t] = signalHeight;
    } else {
      arr[t] = 0;
    }
  }

  return arr;
}

function initFourierRect(ctx, ctx_recon, signal) {
  let values = fourier(signal);
  let options = getDefaultOptionsFourier("Frequenz [kHz]");

  let chart = new Chart(ctx, {
    type: "bar",
    data: getData(values[2], values[0]),
    options: options,
  });

  initReconstructedSignal(ctx_recon, values[0], values[1]);
}

function initReconstructedSignal(ctx, c, phi, withAnnotation = true) {
  let values = reconstructedSignal(c, phi);
  let options = getDefaultOptions("Zeit [ms]");

  if (withAnnotation) {
    prepareAnnotations(options);
    addAnnotationX(options, "𝜏", Tin, "𝜏 = " + Tin);
  }

  let chart = new Chart(ctx, {
    type: "line",
    data: getData(values[0], values[1]),
    options: options,
  });
}

function labelSignal(signal) {
  let label = new Array(signal.length);

  for (t = 0; t < signal.length; t += samplingInterval) {
    label[t] = t;
  }
  return [label, signal];
}
