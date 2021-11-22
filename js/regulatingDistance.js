google.charts.setOnLoadCallback(drawLowPass);
google.charts.setOnLoadCallback(drawLowPassSin);
google.charts.setOnLoadCallback(drawRegulatingDistance);

function lowPass() {
  let lowPass = [];

  let Uc = 0; // V
  let Ue = 1;
  let dt = 1;

  let Tmax = T2 * 5; // 5 * τ

  for (i = 0; i < Tmax; i++) {
    Uc = Uc + (dt / T2) * (Ue - Uc);
    lowPass.push([i, Uc, i == T2 ? Uc : null, null]);
  }

  drawPoint("τ", lowPass, T2);
  return lowPass;
}

function lowPassSin() {
  let lowPass = [];
  let Usin = 0;
  let Uc = 0;
  let dt = 1;

  let Tmax = T2 * 25; // 5 * τ

  for (i = 0; i < Tmax; i++) {
    Usin = 10 * Math.sin((1 / T2) * i);
    Uc = Uc + (dt / T2) * (Usin - Uc);
    lowPass.push([i, Uc, Usin]);
  }

  return lowPass;
}

function regulatingDistance() {
  let arr = [];
  let Ue = 1;
  let Uc1 = 0;
  let Uc2 = 0;
  let dt = 1;

  let Tmax = T2 * 5;

  let Ua_n1 = 0;
  let Ua_n2 = 0;
  let posTurningPoint = -1;
  let tpRise = -1;
  let tpValue = -1;
  let UaMax = -Infinity;

  for (i = 0; i < Tmax; i++) {
    Uc1 = Uc1 + (dt / T1) * (Ue - Uc1);
    Uc2 = Uc2 + (dt / T2) * (Uc1 - Uc2);
    Ua = Uc2 * Vs;

    let Ua_1 = Ua - Ua_n1;
    let Ua_2 = Ua_1 - Ua_n2;

    if (Ua_n2 >= 0 && Ua_2 <= 0 && posTurningPoint == -1) {
      posTurningPoint = i;
      tpRise = Ua_1;
      tpValue = Ua;
    }

    Ua_n1 = Ua;
    Ua_n2 = Ua_1;

    UaMax = Math.max(UaMax, Ua);

    arr.push([i, Ua]);
  }

  let offset = tpValue - tpRise * posTurningPoint;

  var Tu_x = -1;
  var Tu_y = -1;
  var Ta_x = -1;
  var Ta_y = -1;

  for (i = 0; i < Tmax; i++) {
    let graph = i * tpRise + offset;
    arr[i][2] = UaMax;
    arr[i][3] = 0 <= graph && graph <= UaMax ? graph : null;
    arr[i][4] = null;
    arr[i][5] = null;
    arr[i][6] = null;
    arr[i][7] = null;

    if (Tu_x == -1 && graph >= 0) {
      Tu_x = i;
      Tu_y = graph;
    }

    if (Ta_x == -1 && graph >= UaMax) {
      Ta_x = i;
      Ta_y = graph;
    }
  }

  arr[Tu_x][4] = Tu_y;
  arr[Tu_x][5] = "Tu = " + Tu_x;
  arr[Ta_x][6] = Ta_y;
  arr[Ta_x][7] = "Ta = " + Ta_x;

  return arr;
}

function drawLowPass() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Uout");
  data.addColumn("number", "markedPoints");
  data.addColumn({ type: "string", role: "annotation" });

  data.addRows(lowPass());

  let options = getDefaultOptions("Low-pass filter 1st order");
  options.series = {
    1: {
      annotations: {
        textStyle: { fontSize: 15, color: "red" },
      },
      pointSize: 5,
      visibleInLegend: false,
    },
  };

  let chart = new google.visualization.LineChart(
    document.getElementById("low_pass")
  );

  chart.draw(data, options);
}

function drawLowPassSin() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Uout");
  data.addColumn("number", "Usin");

  data.addRows(lowPassSin());

  let options = getDefaultOptions("Low-pass filter 1st order with sin");
  options.series = {
    1: {
      type: "line",
      lineDashStyle: [2, 2],
    },
  };

  let chart = new google.visualization.LineChart(
    document.getElementById("low_pass_sin")
  );

  chart.draw(data, options);
}

function drawRegulatingDistance() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Uout");
  data.addColumn("number", "Umax");
  data.addColumn("number", "Turning tangent");
  data.addColumn("number", "Tu");
  data.addColumn({ type: "string", role: "annotation" });
  data.addColumn("number", "Ta");
  data.addColumn({ type: "string", role: "annotation" });

  data.addRows(regulatingDistance());

  let options = getDefaultOptions("Regulating distance");
  options.series = {
    2: { color: "#f1ca3a" },
    3: {
      color: "#f1ca3a",
      annotations: {
        textStyle: { fontSize: 15, color: "#f1ca3a" },
      },
      pointSize: 5,
      visibleInLegend: false,
    },
    4: {
      color: "#f1ca3a",
      annotations: {
        textStyle: { fontSize: 15, color: "#f1ca3a" },
      },

      pointSize: 5,
      visibleInLegend: false,
    },
  };

  let chart = new google.visualization.LineChart(
    document.getElementById("regulating_distance")
  );

  chart.draw(data, options);
}
