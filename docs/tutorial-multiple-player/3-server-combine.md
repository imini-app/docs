---
sidebar_position: 3
---

# 3. A complete colyseus/matter.js game server
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