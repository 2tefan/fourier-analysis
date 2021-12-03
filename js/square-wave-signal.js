window.onresize = redraw;
window.onload = init;
Chart.register(ChartDataLabels);

function redraw() {
  $(".canvas_resize").each(function (i, obj) {
    $(this).css("width", "100%");
  });
}

function init() {
  initPlainRect();
  initFourierRect();
}

function initPlainRect() {
  const ctx = $("#signal_plain_rect");
  let values = plainRect();
  let options = getDefaultOptions("Zeit [ms]");
  prepareAnnotations(options);
  addAnnotationX(options, "𝜏", Tin, "𝜏 = " + Tin);

  let chart = new Chart(ctx, {
    type: "line",
    data: getData(values[0], values[1]),
    options: options,
  });
}

function initFourierRect() {
  const ctx = $("#signal_fourier_rect");
  let values = fourierRect();
  let options = getDefaultOptionsFourier("Frequenz [kHz]");

  let chart = new Chart(ctx, {
    type: "bar",
    data: getData(values[0], values[1]),
    options: options,
  });
}

function initReconstructedSignal(poiFromFourier) {
  const ctx = $("#signal_reconstructed");
  let values = reconstructedSignal(poiFromFourier);
  let options = getDefaultOptions("Zeit [ms]");
  prepareAnnotations(options);
  addAnnotationX(options, "𝜏", Tin, "𝜏 = " + Tin);

  let chart = new Chart(ctx, {
    type: "line",
    data: getData(values[0], values[1]),
    options: options,
  });
}

function getSignal() {
  let arr = new Array(Tmeasuring);

  for (t = 0; t < Tmeasuring; t += samplingInterval) {
    if (t % Tin < Tin / 2) {
      arr[t] = signalHeight;
    } else {
      arr[t] = 0;
    }
  }

  return arr;
}

function plainRect() {
  let label = new Array(Tmeasuring);
  let signal = getSignal();

  for (t = 0; t < Tmeasuring; t += samplingInterval) {
    label[t] = t;
  }

  $("#signal_plain_rect_period").text(formatFloat(Tin));
  $("#signal_plain_rect_frequency").text(formatFloat(1000 / Tin));
  $("#signal_plain_rect_amplitude").text(formatFloat(signalHeight));
  return [label, signal];
}

function fourierRect() {
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

    for (t = 0; t < Tmeasuring; t++) {
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

  $("#signal_fourier_rect_measuring_time").text(formatFloat(Tmeasuring));

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
