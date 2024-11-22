window.addEventListener("load", () => {
  const canvas = document.querySelector("#canvas");
  const difficulty_select = document.querySelector("#difficulty");
  const start_btn = document.querySelector("#start_btn");
  const menu = document.querySelector("#menu");
  let canvaswidth = (canvas.width = window.innerWidth);
  let canvasheight = (canvas.height = window.innerHeight);
  let ctx = canvas.getContext("2d");
  let oppspeed = 1;
  let ballspeed = 1.5;
  let difficulty = "Easy";
  let isgameStarted = false;

  difficulty_select.addEventListener("change", () => {
    difficulty = difficulty_select.value;
  });

  window.addEventListener("resize", () => {
    canvaswidth = canvas.width = window.innerWidth;
    canvasheight = canvas.height = window.innerHeight;
  });

  let mouse = {
    x: 0,
    y: canvasheight / 2,
  };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  let circle = {
    x: canvaswidth / 2,
    y: canvasheight / 2,
    radius: 30,
    dx: 5,
    dy: 5,
  };

  let user = {
    x: 10,
    y: 0,
    dx: 4,
    dy: 4,
    width: 25,
    height: 80,
    score: 0,
  };

  let user2 = {
    x: canvaswidth - 25 - 10,
    y: 0,
    dx: 4,
    dy: 4,
    width: 25,
    height: 80,
    score: 0,
  };

  const drawUser = (x, y, width, height, color) => {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  const drawUser2 = (x, y, width, height, color) => {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  const moveUser = () => {
    user.y = mouse.y - user.height / 2;
    if (user.y + user.height >= canvasheight) {
      user.y = canvasheight - user.height;
    }
    if (user.y <= 0) {
      user.y -= user.y;
    }
  };

  const moveUser2 = () => {
    if (user2.y + user2.height >= canvasheight || user2.y <= 0) {
      user2.dy = -user2.dy;
    }
  };

  const drawCircle = (x, y, radius) => {
    this.x = x;
    this.y = y;
    this.radius = radius;
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
  };

  const moveCircle = () => {
    circle.x += circle.dx * ballspeed;
    circle.y += circle.dy * ballspeed;
    if (detectCollision(circle, user)) {
      circle.dx = -circle.dx;
    }
    if (detectCollision(circle, user2)) {
      circle.dx = -circle.dx;
    }
    if (
      circle.y + circle.radius >= canvasheight ||
      circle.y - circle.radius <= 0
    ) {
      circle.dy = -circle.dy;
    }
  };

  const detectCollision = (b, u) => {
    u.top = u.y;
    u.bottom = u.y + u.height;
    u.left = u.x;
    u.right = u.x + u.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    if (
      b.bottom > u.top &&
      b.top < u.bottom &&
      b.left < u.right &&
      b.right > u.left
    ) {
      return true;
    } else {
      return false;
    }
  };

  const drawline = () => {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineTo(canvaswidth / 2, 0);
    ctx.lineTo(canvaswidth / 2, canvasheight);
    ctx.stroke();
    ctx.closePath();
  };

  const drawScore = () => {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(`My Score: ${user.score}`, canvaswidth / 6, 50);
    ctx.fillText(`Opponent Score: ${user2.score}`, 4 * (canvaswidth / 6), 50);
    ctx.closePath();
  };

  const changeScore = () => {
    if (circle.x + circle.radius > canvaswidth) {
      user.score += 1;
      if (ballspeed <= 2.5) {
        ballspeed += 0.1;
      }
      console.log(
        `OppSpeed: ${oppspeed}, BallSpeed: ${ballspeed} ,  user2dy: ${user2.dy}`
      );
      resetBall();
    } else if (circle.x - circle.radius < 0) {
      user2.score += 1;
      resetBall();
    }
  };

  const resetBall = () => {
    circle.x = canvaswidth / 2;
    circle.y = canvasheight / 2;
    circle.dx = -circle.dx;
  };

  const init = () => {
    drawCircle(circle.x, circle.y, circle.radius);
    moveCircle();
    drawUser(user.x, user.y, user.width, user.height, "cyan");
    drawUser2(user2.x, user2.y, user2.width, user2.height, "red");
    moveUser();
    moveUser2();
    drawScore();
    changeScore();
    drawline();
  };

  let startGame = () => {
    if (difficulty === "Easy") {
      user2.y += user2.dy * oppspeed;
    } else if (difficulty === "Medium") {
      ballspeed = 2;
      oppspeed = 3;
      user2.y += user2.dy * oppspeed;
    } else if (difficulty === "Unbeatable") {
      ballspeed = 2.5;
      user2.y = circle.y - user2.height / 2;
    }
    init();
  };

  start_btn.addEventListener("click", () => {
    menu.style.display = "none";
    startGame();
    isgameStarted = true;
    console.log(difficulty);
  });

  function animate() {
    ctx.clearRect(0, 0, canvaswidth, canvasheight);
    if (isgameStarted) {
      startGame();
    }

    requestAnimationFrame(animate);
  }

  animate();
});
