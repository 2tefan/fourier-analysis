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
}

function initUnknownSignal() {
  const ctx = $("#signal_unknown");
  let signal = getSignal();
  let values = labelSignal(signal);
  let options = getDefaultOptions("Zeit [ms]");

  prepareAnnotations(options);
  addAnnotationX(options, "𝜏", Tin, "𝜏 = " + Tin);
  
  $("#signal_plain_rect_period").text(formatFloat(Tin));
  $("#signal_plain_rect_frequency").text(formatFloat(1000 / Tin));
  $("#signal_plain_rect_amplitude").text(formatFloat(signalHeight));

  $("#signal_fourier_rect_measuring_time").text(formatFloat(Tmeasuring));

  let chart = new Chart(ctx, {
    type: "line",
    data: getData(values[0], values[1]),
    options: options,
  });

  initFourier(
    $("#signal_unknown_fourier"),
    $("#signal_unknown_reconstructed"),
    signal
  );
}

function initFourier(ctx, ctx_recon, signal) {
  let values = fourier(signal);
  let options = getDefaultOptionsFourier(
    "Frequenz [kHz]",
    (ymax = number * 15)
  );

  let chart = new Chart(ctx, {
    type: "bar",
    data: getData(values[0], values[1]),
    options: options,
  });
 
  initReconstructedSignal(ctx_recon, values[2], values[3]);
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

