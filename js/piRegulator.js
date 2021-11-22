google.charts.setOnLoadCallback(drawPRegulator);
google.charts.setOnLoadCallback(drawPIRegulator);

function pRegulator() {
  let arr = [];
  let Ur = 0;
  let Uc1 = 0;
  let Uc2 = 0;
  let dt = 1;
  let Tmax = T2 * 3;
  let Ua = 0;
  let Uamax = 0;

  let Kp = getKp();

  let Ua_n1 = Ua;

  let maxValuePassed = false;
  let minValuePassed = false;
  let e;

  for (i = 0; i < Tmax; i++) {
    e = targetValue - Ua;
    Ur = Kp * e;

    Uc1 = Uc1 + (dt / T1) * (Ur - Uc1);
    Uc2 = Uc2 + (dt / T2) * (Uc1 - Uc2);
    Ua = Uc2 * Vs;

    arr.push([i, Ua, null, null, null, null, null, null, targetValue]);

    if (!maxValuePassed && Ua_n1 > Ua) {
      maxValuePassed = true;
      addPoint(arr, Ua, "Umax", i, 2);
      Uamax = Ua;
    }

    if (maxValuePassed && !minValuePassed && Ua_n1 < Ua) {
      minValuePassed = true;
      addPoint(arr, Ua, "Umin", i, 4);
    }

    Ua_n1 = Ua;
  }

  // control deviation
  addPoint(arr, Ua, "Udev", Tmax - 1, 6);

  addOvershoot("#p_regulator_overshoot", Uamax, Ua);

  $("#p_regulator_kp").text(formatFloat(Kp));
  $("#p_regulator_udev").text(formatFloat(targetValue - Ua) + " °C");
  return arr;
}

function piRegulator() {
  let arr = [];
  let Up = 0;
  let Ui = 0;
  let Ur = 0;

  let Uc1 = 0;
  let Uc2 = 0;
  let dt = 1;
  let Tmax = T2 * 3;
  let Ua = 0;

  let Kp = getKp();
  let Tn = T2;
  let Ti = Tn / Kp;

  let Ua_n1 = Ua;

  let maxValuePassed = false;
  let minValuePassed = false;
  let targetValuePassed = false;
  let e = 0;

  for (i = 0; i < Tmax; i++) {
    e = targetValue - Ua;
    Up = Kp * e;
    Ui = Ui + (e * dt) / Ti;
    Ur = Up + Ui;

    Uc1 = Uc1 + (dt / T1) * (Ur - Uc1);
    Uc2 = Uc2 + (dt / T2) * (Uc1 - Uc2);
    Ua = Uc2 * Vs;

    arr.push([
      i,
      Ua,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      targetValue,
    ]);

    if (!targetValuePassed && Ua >= targetValue) {
      targetValuePassed = true;
      addPoint(arr, Ua, "trise", i, 2);
    }

    if (!maxValuePassed && Ua_n1 > Ua) {
      maxValuePassed = true;
      addPoint(arr, Ua, "Umax", i, 4);
      Uamax = Ua;
    }

    if (maxValuePassed && !minValuePassed && Ua_n1 < Ua) {
      minValuePassed = true;
      addPoint(arr, Ua, "Umin", i, 6);
    }

    Ua_n1 = Ua;
  }

  // control deviation
  addPoint(arr, Ua, "Udev", Tmax - 1, 8);

  addOvershoot("#pi_regulator_overshoot", Uamax, Ua);

  $("#pi_regulator_kp").text(formatFloat(Kp));
  $("#pi_regulator_tn").text(formatFloat(Tn) + " s");
  $("#pi_regulator_udev").text(formatFloat(targetValue - Ua) + " °C");
  return arr;
}

function drawPRegulator() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Uout");
  data.addColumn("number", "Max");
  data.addColumn({ type: "string", role: "annotation" });
  data.addColumn("number", "Min");
  data.addColumn({ type: "string", role: "annotation" });
  data.addColumn("number", "control deviation");
  data.addColumn({ type: "string", role: "annotation" });
  data.addColumn("number", "Target value");

  data.addRows(pRegulator());

  let options = getDefaultOptions("P-Regulator");
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
  };

  options.annotations = {
    fontSize: 15,
  };

  let chart = new google.visualization.LineChart(
    document.getElementById("p_regulator")
  );

  chart.draw(data, options);
}

function drawPIRegulator() {
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

  data.addRows(piRegulator());

  let options = getDefaultOptions("PI-Regulator");
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
    document.getElementById("pi_regulator")
  );

  chart.draw(data, options);
}
