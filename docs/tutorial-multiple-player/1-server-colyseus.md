---
sidebar_position: 1
---

# Server 1: Game Server using Colyseus.js
Multiple player game is hard. But nowadays, there are some good framework out there you can use to
quickly mock up your online game.

One of server side framework that bases on node.js and is good to use is [colyseus.js](https://colyseus.io)

## Introduction
Colyseus is a framework based on node.js/websocket. Each clients connects to a distinct room using websocket
based on room type and room identifier.

- Whenever a new user is connected, it will receive a full copy of the state from the server
- Afterwards, updates of the server state will be continuously sent to clients using efficient algorithms. Each client will
use those updates from the server to maintain the rendering in sync with server.

![networking using colyseus](/img/state-sync.png)

[More details about how colyseus works in syncing state ▶](https://docs.colyseus.io/colyseus/state/overview/)

## Basic concepts
Whenever you are learning something new, one of the most important aspects is to understand the terms and concepts.

There are several main concepts we will need to explain a bit more here to help you understand better before diving
into details.

### 1. Schema
The basic building block in the colyseus is state object defined by a schema.
```js title="Schema defining a player"
export class Player extends Schema {
  @type("number")
  x = Math.floor(Math.random() * 400);

  @type("number")
  y = Math.floor(Math.random() * 400);

  @type("number")
  angle = 0
}
```
The example above defines the schema of a player object inside a 2D game. x and y track the position of the player,
while the angle tracks the rotation of the player.

And the whole state in a game room can be defined in a schema too.
```js title="Schema defining the whole game room state"
export class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  @type([Player])
  balls = new ArraySchema<Player>();

  // Not synced to clients. Internal use
  engine = Engine.create()

  setBalls(balls) {
    this.balls = balls;
  }

  addBall(ball) {
    this.balls.push(ball);
  }

  createPlayer(sessionId: string, target: string) {
    const newPlayer = new Player();
    newPlayer.name = sessionId;
    newPlayer.target = target;
    this.players.set(sessionId, newPlayer);
  }
```
The state above defines a game room where we have a list of players and a list of balls.
Notice that the `players` and `balls` are both based on the player schema we defined in the first example.

Also, you notice that in the schema, you can have variables, for example `engine`, that are not synced to clients.

And, you could add functions/methods to change the state variables inside the schema, for example `setBalls()`.

:::tip Work on your schemas
Use a well well defined sets of Schemas in colyseus is the most fundamental building blocks in your multiple player game.
And usually, you will need a minimal of player schema and a state schema like the two examples above.
:::

### 2. Room
A room in a multiple player game is the place the clients share information with each other. It can have a lot of forms and each room
can serve a different purposes.

For example, the most import room in a multiple player game is the game state room. You can also have some complimentary rooms,
like a chat room where the clients can send/receive short messages from each other.

Usually the room is the place where you manage how a client join, leave, etc.

```js title="A game state room example"
export class MatterjsRoom extends Room<State> {
  maxClients = 4;
  engine = null;

  onCreate(options) {
    // A room has a state.
    this.setState(new State());

    // A engine we will use later
    this.engine = new GameEngine(this.state);

    // Define how we react to commands/messages received from client
    this.onMessage("move", (client, data) =>
      this.engine.processPlayerAction(client.sessionId, data);
    });

    // A room have the loop
    this.setSimulationInterval((deltaTime) => this.update(deltaTime));
  }

  // Update method in the game loop
  update(deltaTime) {
    Engine.update(this.engine.engine, deltaTime)
  }

  // A new client joined
  onJoin(client: Client) {
    this.engine.addPlayer(client.sessionId);
  }

  onLeave(client) {
    this.engine.removePlayer(client.sessionId);
  }

  onDispose() {
    console.log("Dispose MatterjsRoom");
  }

}
```

If you see the above example, there are lot of things going on. You can think of the room as the controller of the game state defined in your game schema.
You will change the game state in the room based on all kinds of events, including actions taken by a player from the client side.

### 3. Arena
Arena is the main interface between a webserver and the game room we have just defined. Typically, an arena can have a list of rooms defined
and also it takes care of serving our server to the internet. Usually, you don't have to worry about too much on this.

```js title="Arena with a list of different type of game rooms"
import { MatterjsRoom } from './rooms/matterjs';
export default Arena({
    getId: () => "My Game Server",
    initializeGameServer: (gameServer) => {
        // Define "chat" room
        gameServer.define("chat", ChatRoom)
            .enableRealtimeListing();

        // Define our main game server room
        gameServer.define("matterjs", MatterjsRoom).filterBy(['gamePIN']);

        gameServer.onShutdown(function(){
          console.log(`game server is going down.`);
        });
    },

    // Our main web server using express.js
    initializeExpress: (app) => {
        app.use('/', serveIndex(path.join(__dirname, "static"), {'icons': true}))
        app.use('/', express.static(path.join(__dirname, "static")));
        app.use('/colyseus', monitor());
    },
});
```




## Misc
:::tip Server side networking
Colyseus is a node.js based server, using websocket to sync states between the server and the clients.
:::