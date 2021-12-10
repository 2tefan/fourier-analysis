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
}

function initPlainRect() {
  const ctx = $("#signal_plain_rect");
  let signal = getRectSignal();
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

  initFourierRect(
    $("#signal_fourier_rect"),
    $("#signal_reconstructed"),
    signal
  );
}
