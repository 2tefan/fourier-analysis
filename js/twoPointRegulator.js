google.charts.setOnLoadCallback(drawTwoPointRegulator);
google.charts.setOnLoadCallback(drawTwoPointRegulatorWithoutUr);

function twoPointRegulator() {
  let arr = [];
  let Ur = 0;
  let Uc1 = 0;
  let Uc2 = 0;
  let dt = 1;
  let Tmax = T2 * 5;
  let Ua = 0;

  let hysteresis = targetValue / 10;
  let upperValue = targetValue + hysteresis;
  let lowerValue = targetValue - hysteresis;

  let Urmax = (2 * targetValue) / Vs;
  let Urmin = 0;

  for (i = 0; i < Tmax; i++) {
    if (Ua > upperValue) Ur = Urmin;

    if (Ua < lowerValue) Ur = Urmax;

    Uc1 = Uc1 + (dt / T1) * (Ur - Uc1);
    Uc2 = Uc2 + (dt / T2) * (Uc1 - Uc2);
    Ua = Uc2 * Vs;

    arr.push([i, Ua, Ur]);
  }

  return arr;
}

function twoPointRegulatorWithoutUr() {
  let arr = [];
  let Ur = 0;
  let Uc1 = 0;
  let Uc2 = 0;
  let dt = 1;
  let Tmax = T2 * 2;
  let Ua = 0;

  let hysteresis = targetValue / 10;
  let upperValue = targetValue + hysteresis;
  let lowerValue = targetValue - hysteresis;

  let Urmax = (2 * targetValue) / Vs;
  let Urmin = 0;

  let targetValuePassed = false;
  let Ua_n1 = Ua;

  let maxValuePassed = false;
  let minValuePassed = false;

  for (i = 0; i < Tmax; i++) {
    if (Ua > upperValue) Ur = Urmin;

    if (Ua < lowerValue) Ur = Urmax;

    Uc1 = Uc1 + (dt / T1) * (Ur - Uc1);
    Uc2 = Uc2 + (dt / T2) * (Uc1 - Uc2);
    Ua = Uc2 * Vs;

    arr.push([i, Ua, null, null, null, null, null, null, targetValue]);

    if (!targetValuePassed && Ua >= targetValue) {
      targetValuePassed = true;
      arr[i - 1][2] = Ua;
      drawPoint("trise", arr, i - 1, 3);
    }

    if (!maxValuePassed && Ua_n1 > Ua) {
      maxValuePassed = true;
      arr[i - 1][4] = Ua;
      drawPoint("Umax", arr, i - 1, 5);
    }

    if (maxValuePassed && !minValuePassed && Ua_n1 < Ua) {
      minValuePassed = true;
      arr[i - 1][6] = Ua;
      drawPoint("Umin", arr, i - 1, 7);
    }

    Ua_n1 = Ua;
  }

  return arr;
}

function drawTwoPointRegulator() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Uout");
  data.addColumn("number", "Ur");

  data.addRows(twoPointRegulator());

  let options = getDefaultOptions("2-Point-Regulator");

  let chart = new google.visualization.LineChart(
    document.getElementById("two_point_regulator")
  );

  chart.draw(data, options);
}

function drawTwoPointRegulatorWithoutUr() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Uout");
  data.addColumn("number", "Rise time");
  data.addColumn({ type: "string", role: "annotation" });
  data.addColumn("number", "Max");
  data.addColumn({ type: "string", role: "annotation" });
  data.addColumn("number", "Min");
  data.addColumn({ type: "string", role: "annotation" });
  data.addColumn("number", "Target value");

  data.addRows(twoPointRegulatorWithoutUr());

  let options = getDefaultOptions("2-Point-Regulator");
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
    document.getElementById("two_point_regulator_without_ur")
  );

  chart.draw(data, options);
}
