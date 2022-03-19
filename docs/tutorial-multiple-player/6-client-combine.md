---
sidebar_position: 56
---

# Client 3: A complete colyseus/phaser game client
Now we have two basic building blocks, colyseus javascript client and phaser.io, ready, we can combine them together
to make the final client we need for our online multiplayer game in browser.

## Set up client with both colyseus js client and phaser.io
To combine colyseus and phaser.io together, we will need to include both the library js files first. Also, because we have our
server side using matter.js to simulate the physics world, we will use matter.js as the physics engine in phaser.io.

### 1. Include the javascript libraries in our html
```html title="Set up a html page with colyseus javascript and phaser.io with matter.js as physics"
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width" />
  <script type="text/javascript" src="https://unpkg.com/colyseus.js@^0.14.0/dist/colyseus.js"></script>
  <script src="//cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.js"></script>
  <script type="text/javascript" src="/matter.js"></script>
</head>
<body>
  <div id="phaser-example"></div>
</body>
</html>
```

### 2. Set up colyseus client with phaser.io game
To include the colyseus client, we will need to add the `joinOrCreate` logics inside `create` callback function in phaser.io.
We also need to rely on some of the global params to track everything using `var`, for example, `client`, `room`, `players` etc.

```html title="Initialize a game client"
<body>
  <script>
    // Client
    var host = window.document.location.host.replace(/:.*/, '');
    var port = location.port ? ':' + location.port : '';
    var serverWebsocketUrl = location.protocol.replace("http", "ws") + "//" + host + port;
    var client = new Colyseus.Client(serverWebsocketUrl);

    // Basic game pin
    const urlParams = new URLSearchParams(window.location.search)
    let gamePIN = urlParams.get('pin')
    if (!gamePIN) {
      gamePIN = 'defaultpin'
    }

    // Some other global variables initialization
    var room = null;
    var players = {};
    var myPlayerId = null;
    var myTarget = 'left';

    // Phaser.io config
    var config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: '#c4dedf',
      parent: 'phaser-example', // Use the div container in the body tag in the html
      physics: {
        default: 'matter', // Use matter.js as the default physics
        matter: {
          debug: false,
          gravity: {
            y: 0, // Disable gravity in our top down game
          },
        }
      },
      scene: {
        preload: preload,
        create: create,
      }
    };
    var game = new Phaser.Game(config);
    var matter = null;
    var playerLabels = {};

    // Load some assets, mostly just the images
    function preload() {
      this.load.image('ball', 'ball.png');
      this.load.image('soccer', 'asset/soccer.png');
      this.load.image('goal', 'asset/goal.png');
      this.load.image('arrow', 'asset/arrow.png');
    }

    function create() {
      matter = this.matter; // Set the global matter variable to game physics
      const self = this; // Game reference, used in various callbacks inside colyseus client

      client.joinOrCreate("matterjs", { gamePIN }).then(room_instance => {
        room = room_instance // Set our room instance to global
        myPlayerId = room.sessionId; // Track player own session id.

        // Our room schema has a list of balls
        room.state.balls.onAdd = function (ball) {
          const worldBall = matter.add.image(2000, 2000, 'soccer', null, { isStatic: false, isSensor: true, restitution: 1, friction: 0.02, });
          worldBall.setCircle();
          worldBall.setScale(0.2);
          // We will use the following way of sync room ball state and phaser.io game object
          // ball is the state
          // worldball is the phaser.io game object
          ball.onChange = updateChanges(ball, worldBall, false, self.tweens);
        }

        // Our room schema has a list of players
        room.state.players.onAdd = function (player, sessionId) {
          // Track the session id for myself
          if (sessionId === myPlayerId) {
            myTarget = player.target;
          }

          const worldPlayer = matter.add.image(2000, 2000, 'ball', null, {isStatic: false, isSensor: true, friction: 0.01, restitution: 1.0, density: 2, });
          worldPlayer.setCircle();
          worldPlayer.setBounce(1);
          worldPlayer.setScale(0.2)
          player.onChange = updateChanges(player, worldPlayer, true, self.tweens);

          // Track the game object in the dictionary
          players[sessionId] = worldPlayer;
        }

        // Player can disconnect from the game
        room.state.players.onRemove = function (player, sessionId) {
          players[sessionId].destroy();
          delete players[sessionId];
        }
      });
    }

  </script>
</body>
```

### 3. Game syncing between colyseus state and phaser.io game object
In the above, we use `updateChanges` to sync the position/angle between the colyseus state from the server and the game object in our game.

Note that, we use `tweens` in phaser.io to smooth out the game object changes, especially the position change. This is very important for any server/client multiplayer game
to have smooth rendering for clients.

```js title="function to sync states"
const updateChanges = (stateObject, worldObject, log = false, tweens) => (changes) => {
  // Default the position x and y to game object current x and y
  let targetX = worldObject.body.position.x
  let targetY = worldObject.body.position.y

  // Apply state changes
  changes.forEach(({ field, value }) => {
    switch (field) {
      case 'x':
        targetX = value
        break;
      case 'y':
        targetY = value
        break;
      case 'angle':
        Matter.Body.setAngle(worldObject.body, value);
        break;
      default:
        break;
    }
  });

  // We smooth the position changes using phaser.io tweens.
  // This is very important!!
  // Without this, the game will become very laggy with game object jumps from one point to another.
  // Tried to use matter physics using velocity sync, but it has very poor performance.
  tweens.add({
      targets: worldObject,
      x: targetX,
      y: targetY,
      duration: 200,
      ease: 'Power2'
  });
}
```

### 4. Capture player's actions
You may have been wondering how I can move the my player in the game. So far, we haven't talked about user controls in a game.

And because we are developing a multiplayer online game with a central server, we will need to send capture user actions in javascript and instead of
directly updating game objects in the phaser.io game, we send those actions to servers using the colyseus client.

Below we will add functions to send commands to users. And we will extend our `create` function in phaser.io to detect user actions.

```js title="Functions to capture user actions"
// room is the global variable we have set up above.
// which is the room instance in our colyseus game client
function up() {
  room.send("move", { vy: -1 });
}

function right() {
  room.send("move", { vx: 1 });
}

function down() {
  room.send("move", { vy: 1 })
}

function left() {
  room.send("move", { vx: -1 })
}

function create() {
  // ... previous codes

  // The following is a basic game control capture and send to server loop
  let keys = {};
  const keyDown = e => {
    keys[e.key] = true;
  };
  const keyUp = e => {
    keys[e.key] = false;
  };
  document.addEventListener('keydown', keyDown); // Browser event listener for user actions, including keyboard actions.
  document.addEventListener('keyup', keyUp);
  let loop = () => {
    if (keys["ArrowLeft"]) {
      left();
    }
    if (keys["ArrowRight"]) {
      right();
    }
    if (keys["ArrowUp"]) {
      up();
    }
    if (keys["ArrowDown"]) {
      down();
    }
    // next iteration
    requestAnimationFrame(() => {
      setTimeout(loop, 200);
    });
  }
  // start loop
  setTimeout(loop, 200);
}
```

## Conclusion
Great! We have completed the basic game client code in javascript using colyseus client and phaser.io.

To recap, we will need to do the following
- init our colyseus client using a game pin
- init our phayser.io game
- hook up colyseus room and events in `create` method in phaser.io
- sync colyseus state and game object state in phaser.io based on `onUpdate` events
- use tweens in phaser.io to smoothly change game object positions
- capture user actions and send actions to server

You can find more details in [a complete game client example using colyseus client javascript library with phaser.io](https://github.com/imini-app/multiple-player-colyseus-matter-phaser/blob/master/src/static/phaser-and-matterjs.html)