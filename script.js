const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
drawLayout(ctx)
drawTask(ctx, 5, 7, 'TEXT', "rgb(25, 151, 240)")
drawFlowTask(ctx, 7, 10, 'TEXT Text TEXT', "rgb(252, 79, 140)")
drawFlow(ctx, 9, 10, ['PUBLIC', 'TRANSPORT'], "transparent")
drawFlow(ctx, 10, 19, ['ACTIVITY AT WORK'], "rgba(31, 202, 37, .2)")
// drawRect(ctx)
drawScale(ctx)

function drawTask(ctx, start, end, text = '', color) {
  ctx.fillStyle = color;
  for(let i = convertHour(start); i < convertHour(end); i++) {
    ctx.fillRect(i*100 + 30,60,25,30);
    ctx.fillRect(i*100 + 30+25,60,25,30);
    ctx.fillRect(i*100 + 30+50,60,25,30);
    ctx.fillRect(i*100 + 30+75,60,25,30);
  }
  ctx.textAlign="center";
  const width = (convertHour(end) *100 + 30) - (convertHour(start) * 100 + 30);
  ctx.fillText(text, (convertHour(start) * 100 + 30) + (width /2), 120);
}

function drawFlowTask(ctx, start, end, text, color) {
  ctx.fillStyle = color;
  for(let i = convertHour(start); i < convertHour(end); i++) {
    ctx.fillRect(i*100 + 30,60,25,30);
    ctx.fillRect(i*100 + 30+25,60,25,30);
    ctx.fillRect(i*100 + 30+50,60,25,30);
    ctx.fillRect(i*100 + 30+75,60,25,30);
  }
  ctx.textAlign="center";
  const width = (convertHour(end) *100 + 30) - (convertHour(start) * 100 + 30);
  ctx.fillText(text, (convertHour(start) * 100 + 30) + (width /2), 120);
}

function drawFlow(ctx, start, end, textArray, textColor) {
  ctx.fillStyle = textColor;
  const width = (convertHour(end) *100 + 30) - (convertHour(start) * 100 + 30);
  ctx.fillRect(convertHour(start)*100 + 30, 90, width, 50);
  ctx.fillStyle = "#000";
  ctx.font = 'bold 10px Arial';
  ctx.lineWidth = 3;
  ctx.textAlign="center";
  textArray.map((text, index) => ctx.fillText(text, (convertHour(start) * 100 + 30) + (width / 2), 120 + index * 20));
  ctx.moveTo(convertHour(start) * 100 + 30, 50);
  ctx.lineTo(convertHour(start) * 100 + 30, 160);
  ctx.moveTo(convertHour(end) * 100 + 30, 50);
  ctx.lineTo(convertHour(end) * 100 + 30, 160);
}

function drawLayout(ctx) {
  ctx.fillStyle = "#eee";
  ctx.fillRect(2.5 *100 + 30, 0, 250, 500);
  ctx.fillRect(12 * 100 + 30, 0, 250, 500);
  ctx.fillStyle = "#aeaeae";
  ctx.fillRect(5 *100 + 30, 0, 50, 500);

}

function drawScale(ctx) {
  ctx.fillStyle = "#000";
  ctx.font = '15px Arial';
  ctx.lineWidth = 3;
  for(let i = 0; i < 25; i++) {
    ctx.moveTo(i * 100 + 30, 30);
    ctx.lineTo(i * 100 + 30, 90);
    ctx.fillText(makeHours(i + 5),i*100 + 11, 20);
  }
  ctx.stroke();
  ctx.lineWidth = 1;
  for(let i = 0; i< 24; i++) {
    ctx.moveTo(i*100 + 30 + 25, 40);
    ctx.lineTo(i*100 + 30 + 25, 90);
    ctx.moveTo(i*100 + 30 + 50, 30);
    ctx.lineTo(i*100 + 30 + 50, 90);
    ctx.moveTo(i*100 + 30 + 75, 40);
    ctx.lineTo(i*100 + 30 + 75, 90);
  }
  ctx.stroke();
}

function drawRect(ctx) {
  ctx.fillStyle = "rgb(25, 151, 240)";
  for(let i = 0; i< 4; i++) {
    ctx.fillRect(i*100 + 30,60,25,30);
    ctx.fillRect(i*100 + 30+25,60,25,30);
    ctx.fillRect(i*100 + 30+50,60,25,30);
    ctx.fillRect(i*100 + 30+75,60,25,30);
  }

  ctx.fillStyle = "rgb(252, 79, 140)";
  for(let i = 4; i < 8; i++) {
    ctx.fillRect(i*100 + 30,60,25,30);
    ctx.fillRect(i*100 + 30+25,60,25,30);
    ctx.fillRect(i*100 + 30+50,60,25,30);
    ctx.fillRect(i*100 + 30+75,60,25,30);
  }
  ctx.fillStyle = "rgb(254, 228, 72)";
  for(let i = 8; i< 15; i++) {
    ctx.fillRect(i*100 + 30,60,25,30);
    ctx.fillRect(i*100 + 30+25,60,25,30);
    ctx.fillRect(i*100 + 30+50,60,25,30);
    ctx.fillRect(i*100 + 30+75,60,25,30);
  }
  ctx.fillStyle = "rgb(31, 202, 37)";
  for(let i = 15; i< 24; i++) {
    ctx.fillRect(i*100 + 30,60,25,30);
    ctx.fillRect(i*100 + 30+25,60,25,30);
    ctx.fillRect(i*100 + 30+50,60,25,30);
    ctx.fillRect(i*100 + 30+75,60,25,30);
  }
}

function convertHour(hour) {
  return hour - 5 < 0 ? 24 - hour : hour - 5;
}

function makeHours (i) {
  const value = i < 25 ? i : i - 24;
  const normalizeValue = value < 10 ? `0${value}` : value;
  return `${normalizeValue}:00`;
}
