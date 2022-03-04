---
sidebar_position: 5
---

# Client 2: Game rendering engine using Phaser.io
<iframe src="/html/phaser-example-1.html" width="600" height="400" scrolling="no" style={{overflow: "hidden"}}></iframe>

[Phaser is very popular game engine](https://phaser.io/) (rendering using WebGL and Canvas) for devloping browser based games.
It has a lot of great features and it even has a physics engine directly based on matter.js.

In our first try, we used matter.js rendering engine but it turned out it just lacks features that make the game rendering smoothly.

We later on turned our attention to phaser.io and the ride is much smoother. Note that we only need to render the objects
in the game engine with the states information passed in from the game client.

First let's take a look at how you can create a phaser.io browser game, shown on the top of this page.

## A basic phaser.io game in brower.
### 1. Include the javascript in our html
First, we need to create the basic html page with phaser.io included as external javascript file.

```html title="Include phaser.io javascript libary"
<!DOCTYPE html>
<html>
<head>
  // highlight-start
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/phaser@3.15.1/dist/phaser-arcade-physics.min.js"></script>
  // highlight-end
</head>
<body>
</body>
</html>
```

### 2. Config the game
After that, we can config the game, like width, height, using gravity or not, etc.

```html title="Config phaser game engine"
<body>
  // highlight-start
  <script type="text/javascript">
    var config = {
      type: Phaser.AUTO,
      width: 600,
      height: 400,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 }
        }
      },
    }
  </script>
  // highlight-end
</body>
```

### 3. Define initialization of the game
Like all game engine, we need to define a start up method for the game engine. Like adding some objects.
In phaser.io, commonly you also add a `preload` method to load in your images first to avoid images not shown in initial frames.

In the example game we are building, we will add a background, a logo that are flying around, and also a particel emitter to follow the logo.

```js title="Game initialization"
function preload() {
  this.load.image('sky', '/img/space3.png');
  this.load.image('red', '/img/red.png');
  this.load.image('logo', '/img/logo.png');
}

function create() {
  this.add.image(300, 200, 'sky');

  var particles = this.add.particles('red');

  var emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: 'ADD'
  });

  var logo = this.physics.add.image(300, 100, 'logo');

  logo.setVelocity(100, 200);
  logo.setBounce(1, 1);
  logo.setCollideWorldBounds(true);

  emitter.startFollow(logo);
}
```

### 4. Combine the init methods the game and the start game
After we have defined our initialization methods `preload` and `create`, we can modify our game configuration to include a basic scene
using those two. And start the game with the overall configuration.

```js title="Modify game configuration and start"
<script type="text/javascript">
  var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 400,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 }
      }
    },
    // highlight-start
    scene: {
      preload: preload,
      create: create
    }
    // highlight-end
  }
  // highlight-start
  var game = new Phaser.Game(config);
  // highlight-end
</script>
```

## Conclusion
We choose phaser.io as our game rendering engine on the client side. We demonstrates phaser by creating a flying logo game.
The main concepts you probably need to understand is `game`, `scene`, `preload`, `create`.

We also notice some cool staff phaser can achieve, like the particle effect, background of the game, object follow object.

All games using phaser are evolving arond those basic concepts.