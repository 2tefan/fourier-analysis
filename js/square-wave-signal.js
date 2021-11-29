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

function getSignal(end = Tmeasuring) {
  let arr = new Array(end);

  for (t = 0; t < end; t += samplingInterval) {
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
  let signal = getSignal(Tmeasuring);

  for (t = 0; t < Tmeasuring; t += samplingInterval) {
    label[t] = t;
  }

  $("#signal_plain_rect_period").text(formatFloat(Tin));
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

  for (k = 0; k < numberOfHarmonics; k++) {
    let value = c[k];
    let pos = k * Tresolution * 1000;

    label.push(pos);
    fourier.push(value);
  }

  $("#signal_fourier_rect_measuring_time").text(formatFloat(Tmeasuring));

  return [label, fourier];
}

function drawFourierRect() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Uout");
  data.addColumn({ role: "annotation" });

  data.addRows(fourierRect());

  let options = getDefaultOptionsCurveTypeNone("Fourier Analyse");

  let chart = new google.visualization.ColumnChart(
    document.getElementById("signal_fourier_rect")
  );

  chart.draw(data, options);
}
