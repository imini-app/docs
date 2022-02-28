---
sidebar_position: 2
---

# Server 2: Server side 2D physics game engine using Matter.js

<iframe src="/html/matter-example-1.html" width="600" height="400" scrolling="no" style={{overflow: "hidden"}}></iframe>

If you are building a game that will have physics processing, you will need to find a suitable server side game physics engine.

Because, we are purely running the game engine on a server side environment without an actual browser, we will need a game engine
that can process the physical world without actually rendering the game itself.

One of the most popular 2D physics library [matter.js](https://brm.io/matter-js/) can achieve our goal.
:::tip Phaser.io supports a matter.js physics engine too
A bonus point of using matter.js is that phaser.io, which we will later use as our client game engine.
:::

## Introduction

    Matter.js is a 2D physics engine for the web

If you are building a 2D game, matter.js is a very good choice. In a matter.js world, you can add a variety of objects, like a rectangle, circle,
and any shape you can think of, and matter.js will process all the simulation, including collisions between those.

And since it is based on javascript, it is a matching library that can be used to combine with our colyseus server.

## An Example
To have a better sense of how a 2D world works in matter.js, let's dive into some interesting examples. The example shown top can be created like below

```js title="A 2D world in matter.js"
const width = 600
const height = 400
const engine = Engine.create(), world = engine.world

// create renderer
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: width,
    height: height,
    showAngleIndicator: true,
  }
})

Render.run(render)

// create runner
const runner = Runner.create()
Runner.run(runner, engine)

Composite.add(world, [
  // stuffs
  Bodies.rectangle(30, 30, 20, 40),
  Bodies.circle(130, 130, 15),
  Bodies.polygon(230, 230, 5, 10),
  Bodies.rectangle(200, 250, 300, 5, { isStatic: true, angle: 120 }),

  // walls
  Bodies.rectangle(width/2, 0, width, 20, { isStatic: true }),
  Bodies.rectangle(width/2, height, width, 20, { isStatic: true }),
  Bodies.rectangle(width, height/2, 20, height, { isStatic: true }),
  Bodies.rectangle(0, height/2, 20, height, { isStatic: true })
])
```

## Concepts
### World
World is the overall environment a game is simulated in the matter.js engine. For the world, you can change the gravity to 0 like below
```js title="A world without gravity"
const engine = Engine.create()
const world = engine.world
engine.gravity.y = -1
```

### Body
A body is an object in the world. It has various properties, like position, velocity, angle, mass, shape, density.

#### Static body
A static body is like an obstacle or wall that exists in the game and doesn't move.
```js
Bodies.rectangle(width/2, 0, width, 20, { isStatic: true }),
```

A normal body can have all kinds of shapes. Most commonly used shapes are
```js title="a rectangle"
const rectangle = Bodies.rectangle(x, y, width, height),
```
```js title="a circle"
const circle = Bodies.circle(x, y, radius),
```
```js title="a polygon"
const polygon = Bodies.polygon(x, y, sides, side_length),
```

### Collision
A collision is the event when two bodies in the world collide. Use the `Events` in matter.js to evaluate each collision
```js title="Collision detection and processing using Events"
Events.on(engine, "collisionStart", (event) => {
  const pairs = event.pairs
  const bodyA = pairs[0].bodyA
  const bodyB = pairs[0].bodyB
  // DO some logic based on the bodies
)
```