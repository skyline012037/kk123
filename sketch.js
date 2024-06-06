let prizes = ["獎品1", "獎品2", "獎品3", "獎品4", "獎品5"];
let result = "";
let spinning = false;
let spinAngle = 0;
let spinDuration = 60; // spin duration in frames
let spinCounter = 0;
let eggY = 330; // initial position of the gacha egg
let eggDrop = false;
let eggStay = false;
let eggStayCounter = 0;
let eggStayDuration = 600; // egg stays for 10 seconds (600 frames at 60fps)
let button;
let eggColorTop;
let eggColorBottom;
let balls = [];
let ballColors = ['#FFDDC1', '#FFF4E6', '#D3E3FC', '#E1F7D5', '#FFD9E8']; // 柔和的顏色
let coinX = 50; // 钱币初始位置
let coinY = 50;
let coinRadius = 20;
let coinInserted = false;
let draggingCoin = false;

let colors = [
  '#FFDDC1', // Soft Peach
  '#FFF4E6', // Light Beige
  '#D3E3FC', // Soft Blue
  '#E1F7D5', // Light Mint
  '#FFD9E8'  // Light Pink
];

function setup() {
  createCanvas(400, 400);
  button = createButton('');
  button.size(80, 80); // 设置按钮为正圆形
  button.style('background-color', '#FFD700');
  button.style('border', 'none');
  button.style('border-radius', '50%'); // Make the button circular
  button.style('position', 'absolute');
  button.style('cursor', 'pointer');
  button.mousePressed(startSpin);
  textSize(24); // 增大獎品文字大小
  textAlign(CENTER, CENTER);
  positionButton();
  
  // 初始化隨機飄動的圓球
  for (let i = 0; i < 10; i++) {
    balls.push({
      x: random(150, 250),
      y: random(100, 200),
      size: random(10, 20),
      color: random(ballColors),
      speedX: random(-1, 1),
      speedY: random(-1, 1)
    });
  }
}

function draw() {
  background('#FFF9E6'); // 背景色改為柔和的顏色

  // Draw the gacha machine body
  noStroke();
  fill('#FFC1CC'); // 機器身體的顏色
  rect(100, 100, 200, 250, 20);

  // Draw the glass ball
  fill('#FFF');
  ellipse(200, 150, 180, 180);
  fill('#FFC1CC'); // 玻璃球邊框的顏色
  ellipse(200, 150, 160, 160);

  // Draw the spinning effect
  push();
  translate(200, 150);
  rotate(spinAngle);
  fill('#FFF4E6'); // 玻璃球內部的顏色
  ellipse(0, 0, 140, 140);
  pop();

  // Draw the random floating balls within the glass ball
  for (let ball of balls) {
    fill(ball.color);
    ellipse(ball.x, ball.y, ball.size, ball.size);
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // 碰到玻璃球邊緣反彈
    if (dist(ball.x, ball.y, 200, 150) > 70) {
      ball.speedX *= -1;
      ball.speedY *= -1;
    }
  }

  // Draw the gacha machine base
  fill('#FFC1CC'); // 機器底部顏色
  rect(125, 300, 150, 30, 10);
  
  // Draw the dispensing chute
  fill('#FFB6C1'); // 出口顏色
  rect(140, 330, 120, 20, 10);

  // Draw the prize result egg
  if (!spinning && eggDrop) {
    drawEgg(200, eggY, eggColorTop, eggColorBottom);
    fill(0);
    text(result, 200, eggY); // 在扭蛋上顯示獎品
  }

  // Draw the prize result egg when it stays
  if (eggStay) {
    drawEgg(200, height / 2, eggColorTop, eggColorBottom);
    fill(0);
    text(result, 200, height / 2); // 在扭蛋上顯示獎品
    eggStayCounter++;
    if (eggStayCounter >= eggStayDuration) {
      eggStay = false;
      resetCoin(); // 重置钱币状态
      resetEgg(); // 重置转蛋状态
    }
  }

  // Handle spinning animation
  if (spinning) {
    spinAngle += 0.3;
    spinCounter++;
    if (spinCounter >= spinDuration) {
      spinning = false;
      spinCounter = 0;
      eggDrop = true;
      drawGacha();
    }
  }

  // Draw the coin slot (right below the glass ball)
  fill('#A9A9A9'); // 投幣孔顏色
  rect(250, 230, 40, 10); // 投幣孔位置和大小

  // Draw the coin
  if (!coinInserted) {
    fill('#FFD700'); // 钱币顏色
    ellipse(coinX, coinY, coinRadius * 2, coinRadius * 2); // 钱币
  }
}

function mousePressed() {
  // 检测钱币是否被点击并准备拖动
  if (!coinInserted && dist(mouseX, mouseY, coinX, coinY) < coinRadius) {
    draggingCoin = true;
  }
}

function mouseReleased() {
  // 停止拖动钱币并检查是否投币成功
  if (draggingCoin) {
    draggingCoin = false;
    if (mouseX > 250 && mouseX < 290 && mouseY > 230 && mouseY < 240) {
      if (dist(coinX, coinY, (250 + 290) / 2, (230 + 240) / 2) < coinRadius) {
        coinInserted = true; // 投币成功
        resetEgg(); // 重置转蛋状态
      }
    }
  }
}

function mouseDragged() {
  // 拖动钱币
  if (draggingCoin) {
    coinX = mouseX;
    coinY = mouseY;
  }
}

function startSpin() {
  if (!spinning && !eggDrop && !eggStay && coinInserted) {
    spinning = true;
    result = ""; // Clear the result while spinning
    eggY = 330; // 重置扭蛋位置
    eggColorTop = random(colors); // 隨機選擇一個顏色
    eggColorBottom = random(colors); // 隨機選擇另一個顏色
    addButtonSpin();
  }
}

function drawGacha() {
  let randomIndex = floor(random(prizes.length));
  result = prizes[randomIndex];
}

function positionButton() {
  // Position the button in the center of the gacha machine
  button.position(width / 2 - button.width / 2, height / 2 + 50 - button.height / 2);

  // 添加中心点的横条纹
  let buttonCanvas = createGraphics(80, 80);
  buttonCanvas.noStroke();
  buttonCanvas.fill('#D2691E'); // 深橘色的橫條紋
  buttonCanvas.rect(0, 35, 80, 10); // 绘制粗一点的横条纹
  button.style('background-image', `url(${buttonCanvas.canvas.toDataURL()})`);
}

function drawEgg(x, y, colorTop, colorBottom) {
  noStroke();
  // Draw the top half of the egg
  fill(colorTop);
  arc(x, y, 70, 70, PI, 0); // 增大扭蛋大小
  // Draw the bottom half of the egg
  fill(colorBottom);
  arc(x, y, 70, 70, 0, PI);
}

function addButtonSpin() {
  let startTime = millis();
  let duration = 500; // 旋轉效果持續時間 0.5 秒
  let initialRotation = 0;
  let targetRotation = TWO_PI;

  function animateButton() {
    let elapsedTime = millis() - startTime;
    let progress = min(elapsedTime / duration, 1);
    let currentRotation = lerp(initialRotation, targetRotation, progress);
    button.style('transform', `rotate(${currentRotation}rad)`);

    if (progress < 1) {
      requestAnimationFrame(animateButton);
    } else {
      button.style('transform', 'rotate(0rad)'); // 重置旋轉角度
    }
  }

  animateButton();
}

function resetCoin() {
  coinX = 30; // 将钱币重置到画面左上角
  coinY = 30;
  coinInserted = false; // 重置投币状态
}

function resetEgg() {
  eggDrop = false; // 重置转蛋状态
  eggStay = false;
  eggStayCounter = 0;
  result = "";
}