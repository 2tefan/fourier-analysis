window.onresize = redraw;
window.onload = init;
Chart.register(ChartDataLabels);

Tmeasuring = 1000; // ms
Tresolution = 1 / Tmeasuring; // kHz

function redraw() {
  $(".canvas_resize").each(function (i, obj) {
    $(this).css("width", "100%");
  });
}

function init() {
  initUnknownSignal();
  initFourier();
}

function initUnknownSignal() {
  const ctx = $("#signal_unknown");
  let values = unknownSignal();
  let options = getDefaultOptions("Zeit [ms]");

  let chart = new Chart(ctx, {
    type: "line",
    data: getData(values[0], values[1]),
    options: options,
  });
}

function initFourier() {
  const ctx = $("#signal_unknown_fourier");
  let values = fourierUnknownSignal();
  let options = getDefaultOptionsFourier(
    "Frequenz [kHz]",
    (ymax = number * 15)
  );

  let chart = new Chart(ctx, {
    type: "bar",
    data: getData(values[0], values[1]),
    options: options,
  });
}

function initReconstructedSignal(poiFromFourier) {
  const ctx = $("#signal_unknown_reconstructed");
  let values = reconstructedSignal(poiFromFourier);
  let options = getDefaultOptions("Zeit [ms]");

  let chart = new Chart(ctx, {
    type: "line",
    data: getData(values[0], values[1]),
    options: options,
  });
}

function getSignal() {
  let f = new Array(Tmeasuring);

  var A = number;
  for (t = 0; t < Tmeasuring; t += samplingInterval) {
    f[t] =
      10 *
        A *
        Math.sin(
          ((2 * Math.PI * (A + 10)) / 1000) * t + (A * 2 * Math.PI) / 350
        ) +
      ((A * 10) / 5) *
        Math.cos(
          (A * 2 * Math.PI) / 340 + ((2 * (A + 15) * Math.PI) / 1000) * t
        ) +
      ((10 * A) / 2) *
        Math.sin(
          ((2 * (20 + A) * Math.PI) / 1000) * t + (A * 2 * Math.PI) / 330
        ) +
      5 * A * Math.cos(((2 * Math.PI * 0 * (A + 10)) / 1000) * t) +
      3 * A * Math.sin(((2 * Math.PI * (A + 5)) / 1000) * t * 0);
  }

  return f;
}

function unknownSignal() {
  let label = new Array(Tmeasuring);
  let signal = getSignal();

  for (t = 0; t < Tmeasuring; t += samplingInterval) {
    label[t] = t;
  }

  return [label, signal];
}

function fourierUnknownSignal() {
  let label = [];
  let fourier = [];
  let ft = getSignal();
  let a = 0;
  let b = 0;
  let c = new Array(Tmeasuring);
  let phi = new Array(Tmeasuring);
  let k = 0;

  let poi = [];

  for (k = 0; k < numberOfHarmonics; k++) {
    a = 0;
    b = 0;

    for (t = 0; t < Tmeasuring; t += samplingInterval) {
      a +=
        (2 / Tmeasuring) * ft[t] * Math.cos(2 * Math.PI * k * t * Tresolution);
      b +=
        (2 / Tmeasuring) * ft[t] * Math.sin(2 * Math.PI * k * t * Tresolution);
      c[k] = Math.sqrt(a * a + b * b);
      phi[k] = Math.atan(a / b);
    }
  }
  c[0] = c[0] / 2;

  for (k = 0; k < numberOfHarmonics; k++) {
    let value = c[k];
    let pos = k * Tresolution * 1000;

    label.push(pos);
    fourier.push(value);
    if (value > 1) {
      poi.push([pos, value]);
    }
  }

  $("#signal_unknown_measuring_time").text(formatFloat(Tmeasuring));

  initReconstructedSignal(poi);
  return [label, fourier];
}

function reconstructedSignal(poiFromFourier) {
  let label = new Array(Tmeasuring);
  let signal = new Array(Tmeasuring);

  for (t = 0; t < Tmeasuring; t += samplingInterval) {
    label[t] = t;
    signal[t] = poiFromFourier[0][1];

    for (i = 0; i < poiFromFourier.length; i++) {
      signal[t] +=
        poiFromFourier[i][1] *
        Math.sin((poiFromFourier[i][0] * 2 * Math.PI * t) / 1000);
    }
  }

  return [label, signal];
}
