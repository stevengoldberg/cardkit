import React from "react"

import Client from "./client"
import GameState from "./gamestate"
import GameView from "./gameview"


// toggle verbose logging
let LOG_VERBOSE = false;
console.log_verbose = console.log;
if(!LOG_VERBOSE) {
  console.log_verbose = function(){};
}


let App = React.createClass({
  getInitialState() {
    // Stash things in window for easy debugging
    window.name = `Guest ${Math.floor(Math.random() * 100)}`
    window.game = new GameState(window.name)
    window.client = new Client(window.name, window.game)

    return window.game
  },

  render() {
    return (
      <div className="app">
        <GameView state={this.state} />
      </div>
    );
  }
});

React.render(<App/>, document.body)

