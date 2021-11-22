google.charts.setOnLoadCallback(drawPlainRect);

function plainRect() {
  let arr = [];

  let ft = new Array(Tmeasuring);

  for (t = 0; t < Tmeasuring; t++) {
    if (t % (Tmeasuring / 10) < (Tmeasuring / 20)) {
      ft[t] = signalHeight;
    } else {
      ft[t] = 0;
    }

    arr.push([t, ft[t]]);
  }

  return arr;
}

function drawPlainRect() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Uout");

  data.addRows(plainRect());

  let options = getDefaultOptionsCurveTypeNone("Rechtecksignal");

  let chart = new google.visualization.LineChart(
    document.getElementById("signal_plain_rect")
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
