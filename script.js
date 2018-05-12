const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, canvas.width, canvas.height);
drawLayout(ctx);

let regularFormData = {}
const RegularForm = document.querySelector('#regularForm');

let optimizedFormData = {}
const OptimizedForm = document.querySelector('#optimizedForm');

const submitBtn = document.querySelector('.submitButton');
submitBtn.addEventListener("click", submitHandler)

const downloadLink = document.querySelector('.image');
downloadLink.addEventListener("click", downloadImage);

const downloadFileLink = document.querySelector('.file');
downloadFileLink.addEventListener("click", downloadFile);

const importLink = document.querySelector('#selectFiles');
importLink.addEventListener("change", uploadFile, false);

function uploadFile () {
  const fr = new FileReader();

  fr.onload = function(e) {
    const result = JSON.parse(e.target.result);
    console.log(result)
    regularFormData = result.regularFormData;
    optimizedFormData = result.optimizedFormData;
    startDrawing();
  }

  fr.readAsText(this.files[0]);
}

function downloadImage () {
  downloadLink.href = canvas.toDataURL();
  downloadLink.download = "schedule.png";
}

function downloadFile () {
  const file = new Blob([JSON.stringify({ regularFormData, optimizedFormData })], { type: 'application/json' });
  downloadFileLink.href = URL.createObjectURL(file);
  downloadFileLink.download = "data.json";
}

const colors = ["rgb(25, 151, 240)", "rgb(252, 79, 140)", "rgb(254, 228, 72)", "rgb(31, 202, 37)"];

function serializeFormData (form) {
  return {
    sleepFrom: form.sleepFrom.value,
    sleepTo: form.sleepTo.value,
    wayToWorkFrom: form.wayToWorkFrom.value,
    wayToWorkTo: form.wayToWorkTo.value,
    wayToWorkTransport: form.wayToWorkTransport.value,
    workStart: form.workStart.value,
    workEnd: form.workEnd.value,
    wayFromWorkFrom: form.wayFromWorkFrom.value,
    wayFromWorkTo: form.wayFromWorkTo.value,
    wayFromWorkTransport: form.wayFromWorkTransport.value,
    activityAtHomeFrom: form.activityAtHomeFrom.value,
    activityAtHomeTo: form.activityAtHomeTo.value,
  }
}

function submitHandler () {
  regularFormData = serializeFormData(RegularForm);
  optimizedFormData = serializeFormData(OptimizedForm);
  startDrawing();
}

function startDrawing () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLayout(ctx);
  drawSchedule(regularFormData, 200);
  drawSchedule(optimizedFormData, 600);
}

function drawSchedule (form, startY) {
  if (form.sleepFrom && form.sleepTo) {
    const from = form.sleepFrom;
    const to = form.sleepTo;
    if (to > 5) {
      drawTask(ctx, from, 5, 'SLEEP', "rgb(25, 151, 240)", startY);
      drawTask(ctx, 5, to, 'SLEEP', "rgb(25, 151, 240)", startY);
    } else {
      drawTask(ctx, from, to, 'SLEEP', "rgb(25, 151, 240)", startY);
    }
  }

  if (form.wayToWorkFrom && form.wayToWorkTo) {
    drawTask(ctx, form.wayToWorkFrom, form.wayToWorkTo, '', "rgb(252, 79, 140)", startY)
    drawFlow(
      ctx,
      form.wayToWorkFrom,
      form.wayToWorkTo,
      form.wayToWorkTransport.split(' '),
      "transparent",
      startY
    )
  }

  if (form.workStart && form.workEnd) {
    drawFlowTask(ctx, form.workStart, form.workEnd, '', "rgb(31, 202, 37)", startY)
    drawFlow(ctx, form.workStart, form.workEnd, ['ACTIVITY AT WORK'], "rgba(31, 202, 37, .2)", startY)
  }

  if (form.wayFromWorkFrom && form.wayFromWorkTo) {
    drawTask(ctx, form.wayFromWorkFrom, form.wayFromWorkTo, '', "rgb(252, 79, 140)", startY)
    drawFlow(
      ctx,
      form.wayFromWorkFrom,
      form.wayFromWorkTo,
      form.wayFromWorkTransport.split(' '),
      "transparent",
      startY
    )
  }

  if (form.activityAtHomeFrom && form.activityAtHomeTo) {
    drawFlowTask(ctx, form.activityAtHomeFrom, form.activityAtHomeTo, '', "rgb(31, 202, 37)", startY)
    drawFlow(ctx, form.activityAtHomeFrom, form.activityAtHomeTo, ['ACTIVITY AT HOME'], "rgba(31, 202, 37, .2)", startY)
  }

  drawScale(ctx, startY);
}

function drawTask(ctx, start, end, text = '', color, startY = 30) {
  ctx.save();
  ctx.fillStyle = color;
  let endTime = convertHour(end)
  if (convertHour(end) === 0) {
    endTime = (convertHour(end) < convertHour(start)) ? 24 : 0
  }
    for(let i = convertHour(start); i < endTime; i++) {
    ctx.fillRect(i*100 + 30,startY + 30,25,startY - 170);
    ctx.fillRect(i*100 + 30+25,startY + 30,25,startY - 170);
    ctx.fillRect(i*100 + 30+50,startY + 30,25,startY - 170);
    ctx.fillRect(i*100 + 30+75,startY + 30,25,startY - 170);
  }
  ctx.textAlign="left";
  ctx.font = 'bold 10px Arial';
  ctx.rotate( Math.PI / 2 );
  ctx.translate(0,0);
  const width = (endTime *100 + 30) - (convertHour(start) * 100 + 30);
  ctx.fillText(text, startY + 125, -((convertHour(start) * 100 + 30) + (width /2)));
  ctx.restore();
}

function drawFlowTask(ctx, start, end, text, color, startY = 30) {
  ctx.save();
  ctx.fillStyle = color;
  for(let i = convertHour(start); i < convertHour(end); i++) {
    ctx.fillRect(i*100 + 30,startY + 10,25, 50);
    ctx.fillRect(i*100 + 30+25,startY + 10,25, 50);
    ctx.fillRect(i*100 + 30+50,startY + 10,25, 50);
    ctx.fillRect(i*100 + 30+75,startY + 10,25, 50);
  }
  ctx.textAlign="left";
  ctx.font = 'bold 10px Arial';
  const width = (convertHour(end) *100 + 30) - (convertHour(start) * 100 + 30);
  ctx.rotate( Math.PI / 2 );
  ctx.translate(0,0);
  ctx.fillText(text, startY + 125, -((convertHour(start) * 100 + 30) + (width /2)));
  ctx.restore();
}

function drawFlow(ctx, start, end, textArray, textColor, startY = 30) {
  ctx.fillStyle = textColor;
  const width = (convertHour(end) *100 + 30) - (convertHour(start) * 100 + 30);
  ctx.fillRect(convertHour(start)*100 + 30, startY + 60, width, 50);
  ctx.fillStyle = "#000";
  ctx.font = 'bold 10px Arial';
  ctx.lineWidth = 3;
  ctx.textAlign="center";
  textArray.map((text, index) => ctx.fillText(text, (convertHour(start) * 100 + 30) + (width / 2), startY + 90 + index * 20));
  ctx.moveTo(convertHour(start) * 100 + 30, startY + 20);
  ctx.lineTo(convertHour(start) * 100 + 30, startY + 130);
  ctx.moveTo(convertHour(end) * 100 + 30, startY + 20);
  ctx.lineTo(convertHour(end) * 100 + 30, startY + 130);
}

function drawLayout(ctx) {
  ctx.fillStyle = "#eee";
  ctx.save();
  ctx.font = 'bold 10px Arial';
  ctx.textAlign="center";
  ctx.fillRect(2.5 *100 + 30, 0, 250, 2000);
  ctx.fillStyle = "#000";
  ctx.rotate( Math.PI / 2 );
  ctx.translate(0,0);
  ctx.fillText('HEAVY TRAFFIC', 80, -390);
  ctx.fillText('ON THE WAY AT HOME', 80, -410);
  ctx.restore();
  ctx.save();
  ctx.fillRect(12 * 100 + 30, 0, 250, 2000);
  ctx.font = 'bold 10px Arial';
  ctx.textAlign="center";
  ctx.fillStyle = "#000";
  ctx.rotate( Math.PI / 2 );
  ctx.translate(0,0);
  ctx.fillText('HEAVY TRAFFIC', 80, -1340);
  ctx.fillText('ON THE WAY AT HOME', 80, -1360);
  ctx.restore();
  ctx.fillStyle = "#aeaeae";
  ctx.save();
  ctx.fillRect(5 *100 + 30, 0, 50, 2000);
  ctx.font = 'bold 10px Arial';
  ctx.textAlign="center";
  ctx.fillStyle = "#000";
  ctx.rotate( Math.PI / 2 );
  ctx.translate(0,0);
  ctx.fillText('SCRUM', 80, -545);
  ctx.fillText('STAND-UP MEETING', 80, -555);
  ctx.restore();
}

function drawScale(ctx, startY = 30) {
  ctx.save();
  ctx.fillStyle = "#000";
  ctx.font = '15px Arial';
  ctx.textAlign = 'center';
  ctx.lineWidth = 3;
  for(let i = 0; i < 25; i++) {
    ctx.moveTo(i * 100 + 30, startY);
    ctx.lineTo(i * 100 + 30, startY + 60);
    ctx.fillText(makeHours(i + 5), i*100 + 30, startY - 10);
  }
  ctx.stroke();
  ctx.lineWidth = 1;
  for(let i = 0; i< 24; i++) {
    ctx.moveTo(i*100 + 30 + 25, startY + 10);
    ctx.lineTo(i*100 + 30 + 25, startY + 60);
    ctx.moveTo(i*100 + 30 + 50, startY);
    ctx.lineTo(i*100 + 30 + 50, startY + 60);
    ctx.moveTo(i*100 + 30 + 75, startY + 10);
    ctx.lineTo(i*100 + 30 + 75, startY + 60);
  }
  ctx.stroke();
  ctx.restore();
}

function convertHour(hour) {
  return hour - 5 < 0 ? 24 + (hour - 5) : hour - 5;
}

function makeHours (i) {
  const value = i < 25 ? i : i - 24;
  const normalizeValue = value < 10 ? `0${value}` : value;
  return `${normalizeValue}:00`;
}
