const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, canvas.width, canvas.height);
const RegularForm = document.querySelector('#regularForm');
RegularForm.addEventListener("submit", submitRegularHandler);

const OptimizedForm = document.querySelector('#optimizedForm');
OptimizedForm.addEventListener("submit", submitOptimizedHandler);

const colors = ["rgb(25, 151, 240)", "rgb(252, 79, 140)", "rgb(254, 228, 72)", "rgb(31, 202, 37)"];

function submitRegularHandler (e) {
  e.preventDefault()
  drawRegularSchedule(RegularForm, 200)
}

function submitOptimizedHandler (e) {
  e.preventDefault()
  drawRegularSchedule(OptimizedForm, 600)
}

function drawRegularSchedule (form, startY) {
  drawLayout(ctx);
  const from = form.sleepFrom.value;
  const to = form.sleepTo.value;
  if (to > 5) {
    drawTask(ctx, from, 5, 'SLEEP', "rgb(25, 151, 240)", startY);
    drawTask(ctx, 5, to, 'SLEEP', "rgb(25, 151, 240)", startY);
  } else {
    drawTask(ctx, from, to, 'SLEEP', "rgb(25, 151, 240)", startY);
  }

  drawTask(ctx, form.wayToWorkFrom.value, form.wayToWorkTo.value, '', "rgb(252, 79, 140)", startY)
  drawFlow(
    ctx,
    form.wayToWorkFrom.value,
    form.wayToWorkTo.value,
    form.wayToWorkTransport.value.split(' '),
    "transparent",
    200
  )


  drawFlowTask(ctx, form.workStart.value, form.workEnd.value, '', "rgb(31, 202, 37)", startY)
  drawFlow(ctx, form.workStart.value, form.workEnd.value, ['ACTIVITY AT WORK'], "rgba(31, 202, 37, .2)", startY)
  drawTask(ctx, form.wayFromWorkFrom.value, form.wayFromWorkTo.value, '', "rgb(252, 79, 140)", startY)
  drawFlow(
    ctx,
    form.wayFromWorkFrom.value,
    form.wayFromWorkTo.value,
    form.wayFromWorkTransport.value.split(' '),
    "transparent",
    startY
  )

  drawFlowTask(ctx, form.activityAtHomeFrom.value, form.activityAtHomeTo.value, '', "rgb(31, 202, 37)", startY)
  drawFlow(ctx, form.activityAtHomeFrom.value, form.activityAtHomeTo.value, ['ACTIVITY AT HOME'], "rgba(31, 202, 37, .2)", startY)
  drawScale(ctx, startY);
}

function drawTask(ctx, start, end, text = '', color, startY = 30) {
  ctx.save();
  ctx.fillStyle = color;
  console.log('s', convertHour(start))
  console.log('e', convertHour(end))
  let endTime = convertHour(end)
  if (convertHour(end) === 0) {
    endTime = (convertHour(end) < convertHour(start)) ? 24 : 0
  }
  console.log('eee', endTime)
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
    ctx.fillRect(i*100 + 30,startY + 10,25,startY - 150);
    ctx.fillRect(i*100 + 30+25,startY + 10,25,startY - 150);
    ctx.fillRect(i*100 + 30+50,startY + 10,25,startY - 150);
    ctx.fillRect(i*100 + 30+75,startY + 10,25,startY - 150);
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
  ctx.fillRect(convertHour(start)*100 + 30, startY + 60, width, startY - 150);
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
  ctx.fillStyle = "#000";
  ctx.font = '15px Arial';
  ctx.textAlign = 'center';
  ctx.lineWidth = 3;
  for(let i = 0; i < 25; i++) {
    ctx.moveTo(i * 100 + 30, startY);
    ctx.lineTo(i * 100 + 30, startY + 60);
    ctx.fillText(makeHours(i + 5),i*100 + 30, startY - 10);
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
}

function convertHour(hour) {
  return hour - 5 < 0 ? 24 + (hour - 5) : hour - 5;
}

function makeHours (i) {
  const value = i < 25 ? i : i - 24;
  const normalizeValue = value < 10 ? `0${value}` : value;
  return `${normalizeValue}:00`;
}
