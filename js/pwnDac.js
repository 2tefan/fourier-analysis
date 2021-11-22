google.charts.setOnLoadCallback(drawCount);
google.charts.setOnLoadCallback(drawPWM);
google.charts.setOnLoadCallback(drawCountSin);
google.charts.setOnLoadCallback(drawPWMSin);

function countOutput() {
  let arr = [];
  let dt = 1;
  let Zcount = 0;

  let Tpwm = 100 + 10 * number;
  let Tmax = Tpwm * 20;
  let targetNumber = 50 + 10 * number;

  for (i = 0; i < Tmax; i += dt) {
    Zcount = i % Tpwm;
    arr.push([i, Zcount, targetNumber]);
  }

  return arr;
}

function pwmOutput() {
  let arr = [];
  let dt = 1;
  let Zcount = 0;
  let Zout = 0;

  let Tpwm = 100 + 10 * number;
  let Tmax = Tpwm * 20;
  let targetNumber = 50 + 10 * number;

  for (i = 0; i < Tmax; i += dt) {
    Zcount = i % Tpwm;

    if (Zcount <= targetNumber) Zout = Tpwm;
    else Zout = 0;

    arr.push([i, Zout]);
  }

  return arr;
}

function countOutputSin() {
  let arr = [];
  let dt = 1;
  let Zcount = 0;
  let Zin;

  let Tpwm = 100 + 10 * number;
  let Tmax = Tpwm * 20;

  let amplitude = Tpwm / 2;
  let Tsin = Tpwm * 20;

  for (i = 0; i < Tmax; i += dt) {
    Zin = amplitude * Math.sin((1 / Tsin) * 2 * Math.PI * i) + amplitude;
    Zcount = i % Tpwm;

    arr.push([i, Zcount, Zin]);
  }

  return arr;
}

function pwmOutputSin() {
  let arr = [];
  let dt = 1;
  let Zcount = 0;
  let Zin;
  let Zout;

  let Tpwm = 100 + 10 * number;
  let Tmax = Tpwm * 20;

  let amplitude = Tpwm / 2;
  let Tsin = 20 * Tpwm;

  for (i = 0; i < Tmax; i += dt) {
    Zin = amplitude * Math.sin((1 / Tsin) * 2 * Math.PI * i) + amplitude;
    Zcount = i % Tpwm;

    if (Zcount <= Zin) Zout = Tpwm;
    else Zout = 0;

    arr.push([i, Zout]);
  }

  return arr;
}

function drawCount() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Z");
  data.addColumn("number", "Zin");

  data.addRows(countOutput());

  let options = getDefaultOptionsDAC("Counter");

  let chart = new google.visualization.LineChart(
    document.getElementById("count_out")
  );

  chart.draw(data, options);
}

function drawPWM() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Zpwm");

  data.addRows(pwmOutput());

  let options = getDefaultOptionsDAC("PWM");

  let chart = new google.visualization.LineChart(
    document.getElementById("pwm_out")
  );

  chart.draw(data, options);
}

function drawCountSin() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Z");
  data.addColumn("number", "Zin");

  data.addRows(countOutputSin());

  let options = getDefaultOptionsDAC("Counter");

  let chart = new google.visualization.LineChart(
    document.getElementById("count_out_sin")
  );

  chart.draw(data, options);
}

function drawPWMSin() {
  let data = new google.visualization.DataTable();
  data.addColumn("number", "t");
  data.addColumn("number", "Zpwm");

  data.addRows(pwmOutputSin());

  let options = getDefaultOptionsDAC("PWM");

  let chart = new google.visualization.LineChart(
    document.getElementById("pwm_out_sin")
  );

  chart.draw(data, options);
}
