const myGameArea = {
    canvas: document.createElement('canvas'),
    frames: 0,
    //this method will be called when i start the game
    start: function () {
      this.canvas.width = 480;
      this.canvas.height = 270;
      this.context = this.canvas.getContext('2d');
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      //this calls the updateGameArea function every 20 milliseconds
      this.interval = setInterval(updateGameArea, 20);

    },
    //this method will clear the entire canvas window
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      },
      //stops the interval. acts as a game over method
      stop: function () {
        clearInterval(this.interval);
      },
      //updates score
      score: function () {
        const points = Math.floor(this.frames / 20);
        this.context.font = '18px serif';
        this.context.fillStyle = 'black';
        this.context.fillText(`Score: ${points}`, 350, 50);
      },
    
    
  };
  //everything relating to the player is in this class
  class Component {
    //if i want circle in constructor i will add: radius, startAngle, endAngle,
    constructor(width, height, color, x, y) {
      this.width = width;
      this.height = height;
      this.color = color;
      this.x = x;
      this.y = y;
      this.speedX = 0;
      this.speedY = 0;
  
    }
    //relates only to the user
    //this method redraws the user with given values
    update() {
      const ctx = myGameArea.context;
      ctx.fillStyle = this.color;
      //if i wanted circle i would use arc() here with this.radius and other properties
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    //this method moves the user
    newPos() {
        this.x += this.speedX;
        this.y += this.speedY;
      }
      left() {
        return this.x;
      }
      right() {
        return this.x + this.width;
      }
      top() {
        return this.y;
      }
      bottom() {
        return this.y + this.height;
      }
      //check the collision with the obstacle
      crashWith(obstacle) {
        return !(this.bottom() < obstacle.top() || this.top() > obstacle.bottom() || this.right() < obstacle.left() || this.left() > obstacle.right());
      }
    
  }
  //creating an instance of the class
  //this is my user rectangle
  const player = new Component(30, 30, 'red', 0, 110);

  //this is the function responsible for the animation part
  //erasing and redrawing everything based on the new positions
  function updateGameArea() {
    myGameArea.clear();
    player.newPos();
    player.update();
    updateObstacles();
    checkGameOver();
    myGameArea.score();


  }
  
  myGameArea.start();

  //
  document.addEventListener('keydown', (event) => {
    switch (event.keyCode) {
        //if i press the up key speedY decreases by 1
      case 38: // up arrow
        player.speedY -= 1;
        break;
      case 40: // down arrow
        player.speedY += 1;
        break;
      case 37: // left arrow
        player.speedX -= 1;
        break;
      case 39: // right arrow
        player.speedX += 1;
        console.log(player.x)
        break;
        //if you have a second player add new cases for their buttons changing player2.speedX
    //   case 87:
    //     player2.speedY -=1
    }
  });
  
  
  document.addEventListener('keyup', (e) => {
    player.speedX = 0;
    player.speedY = 0;
  });
  

  const myObstacles = [];

  function updateObstacles() {
    //frames is getting 1 added to it every 20 milliseconds
    myGameArea.frames += 1;
    for (i = 0; i < myObstacles.length; i++) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
      }
    //this if statement determines the frequency of obstacles spawning
    if (myGameArea.frames % 120 === 0) {
        console.log(myObstacles)
        //all my obstacles should start at the end of my canvas on the right side
      let x = myGameArea.canvas.width;
      //next 3 lines of code are giving us a random number between 20-200
      let minHeight = 20;
      let maxHeight = 200;
      let height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
      let minGap = 50;
      let maxGap = 200;
      let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
      //top obstacle
      myObstacles.push(new Component(10, height, 'green', x, 0));
      //bottom obstacle
      myObstacles.push(new Component(10, x - height - gap, 'green', x, height + gap));
    }
  }


  function checkGameOver() {
    const crashed = myObstacles.some(function (obstacle) {
      return player.crashWith(obstacle);
    });
   
    if (crashed) {
      myGameArea.stop();
    }
  }
  