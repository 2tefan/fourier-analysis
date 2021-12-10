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
  let values = plainSymRect(getRectSignal());
  let options = getDefaultOptions("Zeit [ms]");
  prepareAnnotations(options);
  addAnnotationX(options, "𝜏", Tin, "𝜏 = " + Tin);
  $("#signal_plain_rect_period").text(formatFloat(Tin));
  $("#signal_plain_rect_frequency").text(formatFloat(1000 / Tin));
  $("#signal_plain_rect_amplitude").text(formatFloat(signalHeight));

  let chart = new Chart(ctx, {
    type: "line",
    data: getData(values[0], values[1]),
    options: options,
  });
}

function initFourierRect() {
  const ctx = $("#signal_fourier_rect");
  let values = fourier(getRectSignal());
  let options = getDefaultOptionsFourier("Frequenz [kHz]");

  $("#signal_fourier_rect_measuring_time").text(formatFloat(Tmeasuring));

  let chart = new Chart(ctx, {
    type: "bar",
    data: getData(values[0], values[1]),
    options: options,
  });

  initReconstructedSignal($("#signal_reconstructed"), values[2], values[3]);
}

function initReconstructedSignal(ctx, c, phi) {
  let values = reconstructedSignal(c, phi);
  let options = getDefaultOptions("Zeit [ms]");
  prepareAnnotations(options);
  addAnnotationX(options, "𝜏", Tin, "𝜏 = " + Tin);

  let chart = new Chart(ctx, {
    type: "line",
    data: getData(values[0], values[1]),
    options: options,
  });
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

function plainSymRect(signal) {
  let label = new Array(Tmeasuring);

  for (t = 0; t < Tmeasuring; t += samplingInterval) {
    label[t] = t;
  }
  return [label, signal];
}

