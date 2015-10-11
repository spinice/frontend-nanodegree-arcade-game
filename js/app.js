var levels = [225, 145, 60];
var speeds = [100, 200, 300];

var endOfGameEvent = new Event('endGame');

var levelUpEvent = new Event('levelUp');

// Enemies our player must avoid
var Enemy = function () {
    this.init(1);
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -100;
  };

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    newPosition = this.x + this.speed * dt;
    if(newPosition < ctx.canvas.width) {
        this.x = newPosition;
    }
    else {
        this.x = -100;
    }
    
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.init = function (factor) {
    this.generateEnemy(factor)
};

Enemy.prototype.generateEnemy = function (factor) {
    this.speed = factor * speeds[Math.floor(Math.random() * 2) + 0];
    this.y = levels[Math.floor(Math.random() * 2) + 0];
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function () {
    this.sprite = 'images/char-boy.png';
    this.init();
    
};

Player.prototype.init = function () {
    this.level = 1;
    this.reset();
};

Player.prototype.reset = function () {
    this.x = 200;
    this.y = 375;
};

Player.prototype.update = function () {
    
    if(this.arrow != null) {
        var newPosition;
        if(this.arrow === 'left') {
            newPosition = this.x - 100;
            if(newPosition >= 0) {
                this.x = newPosition;
            }
        }
        else if(this.arrow === 'up') {
            newPosition = this.y - 83;
            if(newPosition >= 35) {
                this.y = newPosition;
            }
            else {
                this.atEnd()
            }
        }
        else if(this.arrow === 'right') {
            newPosition = this.x + 100;
            if(newPosition < 500) {
                this.x = newPosition;
            }
        }
        else if(this.arrow === 'down') {
            newPosition = this.y + 83;
            if(newPosition <= 375) {
                this.y = newPosition;
            }

        }
        this.arrow = null;
    }
    this.collision();
};


Player.prototype.collision = function () {
    for(var i = 0; i < allEnemies.length; i++) {
        if(allEnemies[i].y >= this.y && allEnemies[i].y <= this.y + 40) {
            if(allEnemies[i].x > this.x - 70 && allEnemies[i].x <= this.x) {
                this.init();
                alert("Oh no, you crashed!");
                document.dispatchEvent(endOfGameEvent);
            }
        }
    }
};

Player.prototype.atEnd = function () {
    //after making it to end, reset
    this.reset();
    this.level += 1;
    alert("You win!");
    document.dispatchEvent(levelUpEvent);
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font = "30px Arial";
    ctx.fillText("Level : " + this.level,10,80);
};

Player.prototype.handleInput = function(input) {
    this.arrow = input;
};

Player.prototype.factor = function () {
    if(this.level < 5) {
        return 1;
    }
    else if(this.level < 10) {
        return 1.2;
    }
    else if(this.level < 20) {
        return 1.5;
    }
    else {
        return 2;
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = initEnemies();
var player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

document.addEventListener('endGame', function (e) {
    allEnemies = initEnemies();
});

document.addEventListener('levelUp', function (e) {
     // reset enemies
    for(var i = 0; i < allEnemies.length; i++) {
        allEnemies[i].init(player.factor());
    }
    if(player.level > 5 && allEnemies.length < 4) {
        allEnemies.push(new Enemy());
    }
    if(player.level > 10 && allEnemies.length < 5) {
        allEnemies.push(new Enemy());
    }
});

function initEnemies() {
    var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
    for(var i = 0; i < allEnemies.length; i++) {
        allEnemies[i].init(1);
    }
    return allEnemies;
}



