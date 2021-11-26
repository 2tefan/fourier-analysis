google.charts.setOnLoadCallback(drawPlainRect);
google.charts.setOnLoadCallback(drawFourierRect);

function plainRect() {
  let arr = [];

  let ft = new Array(Tmeasuring);

  for (t = 0; t < Tmeasuring; t++) {
    if (t % Tin < Tin / 2) {
      ft[t] = signalHeight;
    } else {
      ft[t] = 0;
    }
    arr.push([t, ft[t]]);
  }

  $("#signal_plain_rect_period").text(formatFloat(Tin));
  $("#signal_plain_rect_period").text(formatFloat(Tin));
  return arr;
}

function drawPlainRect() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Uout");
  //data.addColumn("number", "dsadasout");

  data.addRows(plainRect());

  let options = getDefaultOptionsCurveTypeNone("Rechtecksignal");

  let chart = new google.visualization.LineChart(
    document.getElementById("signal_plain_rect")
  );

  chart.draw(data, options);
}

function fourierRect() {
  let arr = [];

  let ft = new Array(Tmeasuring);
  let a = 0,
    b = 0;
  let c = new Array(Tmeasuring);
  let phi = new Array(Tmeasuring);
  let k = 0;

  for (t = 0; t < Tmeasuring; t++) {
    if (t % (Tmeasuring / 10) < Tmeasuring / 20) {
      ft[t] = signalHeight;
    } else {
      ft[t] = 0;
    }
  }

  for (k = 0; k < numberOfHarmonics; k++) {
    for (t = 0; t < Tmeasuring; t++) {
      a +=
        (2 / Tmeasuring) * ft[t] * Math.cos(2 * Math.PI * k * t * Tresolution);
      b +=
        (2 / Tmeasuring) * ft[t] * Math.sin(2 * Math.PI * k * t * Tresolution);
      c[k] = Math.sqrt(a * a + b * b);
      phi[k] = Math.atan(a / b);
    }
    a = 0;
    b = 0;
  }

  for (k = 0; k < numberOfHarmonics; k++) {
    arr.push([k * Tresolution * 1000, c[k]]);
  }

  // drawPoint("Test", arr, 6, 3); //TODO
  //$("#signal_plain_rect_c").text(formatFloat(c[0]));

  return arr;
}

function drawFourierRect() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Uout");
  //data.addColumn("number", "dsadasout");

  data.addRows(fourierRect());

  let options = getDefaultOptionsCurveTypeNone("Fourier Analyse");

  let chart = new google.visualization.ColumnChart(
    document.getElementById("signal_fourier_rect")
  );

  chart.draw(data, options);
}

function drawPIDRegulator() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Uout");
  data.addColumn("number", "Rise");
  data.addColumn({ type: "string", role: "annotation" });
  data.addColumn("number", "Max");
  data.addColumn({ type: "string", role: "annotation" });
  data.addColumn("number", "Min");
  data.addColumn({ type: "string", role: "annotation" });
  data.addColumn("number", "control deviation");
  data.addColumn({ type: "string", role: "annotation" });
  data.addColumn("number", "Target value");

  data.addRows(pidRegulator());

  let options = getDefaultOptions("PID-Regulator");
  options.series = {
    1: {
      pointSize: 5,
      visibleInLegend: false,
    },
    2: {
      pointSize: 5,
      visibleInLegend: false,
    },
    3: {
      pointSize: 5,
      visibleInLegend: false,
    },
    4: {
      pointSize: 5,
      visibleInLegend: false,
    },
  };

  options.annotations = {
    fontSize: 15,
  };

  let chart = new google.visualization.LineChart(
    document.getElementById("pid_regulator")
  );

  chart.draw(data, options);
}
