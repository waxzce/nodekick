(function() {
  var clock = 0;
  var socket = null;
  var playerId = null;
  var gameState = { players: [] };
  var gameId = _.last(window.location.href.split('/'));
  var socket = null;

  function up() {
    socket.emit('up', session());
    //$.post("/up", session());
  }

  function left() {
    socket.emit('left', session());
    //$.post("/left", session());
  }

  function right() {
    socket.emit('right', session());
    //$.post("/right", session());
  }

  function down() {
    socket.emit('down', session());
    //$.post("/down", session());
  }

  function session() {
    return { playerId: playerId, gameId: gameId };
  }

  function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  function getPlayer(playerId) {
    return _.findWhere(gameState.players, { id: playerId });
  }

  function init() {
    playerId = guid();
    socket = io.connect('/');
    socket.on('connect', function() {
      socket.emit('joinGame', session());
    });

    socket.on('gamestate', function(state) {
      gameState = state;
      applyGravity();
    });

    setInterval(applyGravity, 1000.0 / 60.0);
  }

  function applyGravity() {
    _.each(app.game.players(), app.gravity.tick);
  }

  app.game = { };
  app.game.playerId = function() { return playerId; };
  app.game.init = init;
  app.game.up = up;
  app.game.down = down;
  app.game.left = left;
  app.game.right = right;
  app.game.getPlayer = getPlayer;
  app.game.clock = function() { return clock; };
  app.game.players = function() { return gameState.players; };
  app.game.boxes = function() { return gameState.boxes; };
})();
