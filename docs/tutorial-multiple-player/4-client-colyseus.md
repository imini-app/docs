---
sidebar_position: 4
---

# Client 1: Game Client using Colyseus javascript client
With our server up and running, we now focus on build out our game clients. We will build our client for web browsers using html5/javascript.
Colyseus has provided a [javascript client libary](https://docs.colyseus.io/colyseus/getting-started/javascript-client/) for us to use.

Let's take a look at how we can build a basic game client connected to a game room running in our server.

## Basic colyseus javascript game client
### 1. Include the javascript in our html
First, we will need to include the javascript library in our html page. Pick a released version and include it like the following.
```html title="Set up a html page with colyseus javascript included"
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width" />
  // highlight-start
  <script type="text/javascript" src="https://unpkg.com/colyseus.js@^0.14.0/dist/colyseus.js"></script>
  // highlight-end
</head>
<body>
</body>
</html>
```

### 2. Initialize game client
Once we have the library in place, we can initialize our client.
```html title="Initialize a game client"
<body>
  // highlight-start
  <script>
    // Get the client host based on url
    var host = window.document.location.host.replace(/:.*/, '');
    // Get the port if any. Usually this is empty in production
    var port = location.port ? ':' + location.port : '';
    // Our game client links to the server using websocket
    var serverWebsocketUrl = location.protocol.replace("http", "ws") + "//" + host + port;
    var client = new Colyseus.Client(serverWebsocketUrl);
  </script>
  // highlight-end
</body>
```

### 3. Join a room
With the client in place, we can now join or create a game room. When joining a room, you need to decide which room type
and also a room number (pin) to join.

The room type should be the same as defined on your server code.

In [our server tutorial](/docs/tutorial-multiple-player/server-colyseus), we defined our room type as this
```js title="server room definition"
gameServer.define("matterjs", MatterjsRoom).filterBy(['gamePIN']);
```

Thus, we will use the following javascript to connect to this game room. Pay special attention to the `room.sessionId`,
this id is very special and we will use it separate yourself from other players in the multiplayer game.

```js title="client room connection"
const urlParams = new URLSearchParams(window.location.search)
let gamePIN = urlParams.get('pin')
if (!gamePIN) {
  gamePIN = 'defaultpin'
}
client.joinOrCreate("matterjs", { gamePIN }).then(room_instance => {
        room = room_instance
        myPlayerId = room.sessionId
})
```

### 4. Add logics to process room state changes
We now need to add game logics inside the `joinOrCreate` callback like below using the room_instance.
``` js title="Game logic inside room instance"
client.joinOrCreate("matterjs", { gamePIN }).then(room_instance => {
    room = room_instance
    myPlayerId = room.sessionId
    // highlight-start
    // A new player is added
    room.state.players.onAdd = function (player, sessionId) {
      // Logic for setting up myself
      if (sessionId === myPlayerId) {
      }

      // Logic for setting up all the player

      // Listen to any changes
      player.onChange = (changes) => {
        console.log(changes, 'changes from game server received')
      }
    }
    // A player has left
    room.state.players.onRemove = function (player, sessionId) {

    }
    // highlight-end
})

```

## Conclusions
Hooray! You have just completed the basic workflow of setting up colyseus game client.
Some important concepts that you probably need to master are `client`, `room` after `joinOrCreate`,
Inside the room instance, `onAdd`, `onRemove`, and inside onAdd, `onChange`