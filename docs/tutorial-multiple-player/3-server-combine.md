---
sidebar_position: 3
---

# Server 3: A complete colyseus/matter.js game server
In this part, we will combine what we have learned about colyseus game server and the matter.js physics engine and make a complete game server
that can has a world running and clients can connect to it.

## Game engine based on matter.js
We will use a game engine based on matter.js to host the physics world with its bodies. This game engine will add and remove objects,
update objects based on collisions and actions from the clients.

Also, any changes in the objects in the world will also be used to update the game room state.

Let's look at this game engine in details.

### 1. Set up of this engine
```js title="Game engine class setup"
import Matter from "matter-js"

export class GameEngine {
  // Matter.js engine
  engine = null
  // Matter.js world
  world = null
  // Colyseus room state. Need to update whenever there are updates in the world.
  state = null

  // Some of the objects in the world we want to track/update
  players = {}

  constructor(state) {
    this.state = state

    this.engine = Matter.Engine.create()
    this.world = this.engine.world
    this.init()
  }

  init() {
    // Add some boundary in our world
    Matter.Composite.add(this.world, [
      Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
      Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
      Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
      Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
    ]);

    this.initUpdateEvents()
    this.initCollisionEvents()
  }

  initUpdateEvents() {
    // Update events to sync bodies in the world to the state.
    Matter.Events.on(this.engine, "afterUpdate", () => {
      for (const key in this.players) {
        // Make sure we still have the player in the world or state.
        if (!this.state.players.get(key) || !this.players[key]) {
          continue
        }
        this.state.players.get(key).x = this.players[key].position.x
        this.state.players.get(key).y = this.players[key].position.y
        this.state.players.get(key).angle = this.players[key].angle
      }
    })
  }

  initCollisionEvents() {
    // The collision events
    Matter.Events.on(this.engine, "collisionStart", (event) => {
      const pairs = event.pairs;
    });
  }
}
```

### 2. Add or remove player
Two of the most fundamental events that a multiplayer game will have are add or move players when clients connect to server.

In the game engine created above, we will add two methods. Note that in colyseus game server, each client will be assigned a session id,
which will be userd as the unique identifier in the engine.

```js title="Add or move a player in GameEngine"
  addPlayer(sessionId) {
    const startX = 100 + parseInt((Math.random() * 500).toFixed());
    const startY = 100 + parseInt((Math.random() * 500).toFixed());
    const radius = 25.6
    const newPlayer = Matter.Bodies.circle(startX, startY, radius, {isStatic: false });
    this.players[sessionId] = newPlayer;

    // Add to world
    Matter.Composite.add(this.world, [newPlayer]);

    // Add to state
    this.state.createPlayer(sessionId)
  }

  removePlayer(sessionId) {
    // Remove from world
    const player = this.players[sessionId]
    Matter.Composite.remove(this.world, [player]);

    // Remove from state
    this.state.removePlayer(sessionId)
  }
```

### 3. Process actions from player
We also need to take of modifying the player body in the world based on actions received from each player.

```js title="Add a process action method in GameEngine"
  processPlayerAction(sessionId, data) {
    const worldPlayer = this.players[sessionId];
    if (!worldPlayer) {
      return;
    }

    const currentVelocity = worldPlayer.velocity
    let newVx = currentVelocity.x;
    let newVy = currentVelocity.y;
    // Modify velocity based on data received from clients.
    if (data.vx) {
      if (Math.abs(data.vx + newVx) < limit) {
        newVx += data.vx;
      }
    }

    if (data.vy) {
      if (Math.abs(data.vy + newVy) < limit) {
        newVy += data.vy;
      }
    }

    // Update in the world
    Matter.Body.setVelocity(worldPlayer, { x: newVx, y: newVy });

    // Update in the state
    this.state.players.get(sessionId).vx = newVx;
    this.state.players.get(sessionId).vy = newVy;
  }
```

## Add game engine to our game room
With the game engine wrapped up, we can add it to the game room in colyseus server.
And link some of the common events and messages from clients to the game engine.

### 1. Update the game room schema
In order to properly update the game room state, we will need add some methods in the game room schema.
Like add a new player, remove a player.

```js title="Improve game room schema in colyseus"
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
export class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  createPlayer(sessionId: string) {
    const newPlayer = new Player();
    newPlayer.name = sessionId;
    this.players.set(sessionId, newPlayer);
  }

  removePlayer(sessionId: string) {
    this.players.delete(sessionId);
  }
}
```

### 2. Add engine and link up room events to engine methods
Now, we can combine the game engine, the game room schema into the game room in colyseus.

```js title="Add game engine to game room"
import { Room, Client } from "colyseus";
export class MatterjsRoom extends Room<State> {
  engine = null;

  onCreate(options) {
    // Create a new state for the game room
    this.setState(new State());

    // Create a new engine and use the state we just created
    this.engine = new GameEngine(this.state);

    // Pass player actions from clients to the game engine
    this.onMessage("move", (client, data) => {
      this.engine.processPlayerAction(client.sessionId, data);
    });

    // Game loop
    this.setSimulationInterval((deltaTime) => this.update(deltaTime));
  }

  update(deltaTime) {
    Matter.Engine.update(this.engine.engine, deltaTime)
  }

  onJoin(client: Client) {
    this.engine.addPlayer(client.sessionId);
  }

  onLeave(client) {
    this.engine.removePlayer(client.sessionId);
  }
```

## Outlines of A complete game server
Congratulations! Now, your have completed the first game server using matter.js and colyseus!

The complete game server code will look like the following.
```js title="Matterjs.ts, a completed game server"
import { Room, Client } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import Matter from "matter-js";

export class GameEngine {
  // GameEngine Code above
}

export class Player extends Schema {
  @type("number")
  x = 0;

  @type("number")
  y = 0;
}

export class State extends Schema {
  // Game room state schema above
}

export class MatterjsRoom extends Room<State> {
  // Colyseus Game room based on matter.js above
}
```

You can checkout [one of our git repository for multiplayer game server codes](https://github.com/imini-app/multiple-player-colyseus-matter-phaser) for more details.