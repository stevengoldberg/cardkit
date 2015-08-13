// React view of a card
import React from "react";
import "./_cardview.scss";
import { shield, swords } from '../../../assets/img'

let Card = React.createClass({

  // layout and style the card
  render() {
    console.log(this.props)
    let combinedCSS = this.cssClassesForCard();

    let attackPart;
    if (this.props.cardInfo.attack) {
      attackPart = (
        <div className="card-details">
            {this.props.cardInfo.description}
          <div className="attack-label">
            {this.props.cardInfo.attack}
            <img className="card-icon-image" src={swords} />
          </div>
          <div className="health-label">
            {this.props.cardInfo.defense}
            <img className="card-icon-image" src={shield} />
          </div>
        </div> 
)
    } else {
      attackPart = (
        <div div className="card-details">
          <div className="spell-text-label">
            {this.props.cardInfo.description}
          </div>
          <div className="spell-flavor">
            {this.props.cardInfo.flavor}
          </div>
        </div>
        )
    }

    return (
      <div className={combinedCSS} onClick={this.selectCard}>
        <div className="card-top"> 
          {this.props.cardInfo.name}
          <div className="mana-label">{this.props.cardInfo.cost}</div>
        </div>
        <div className="card-bottom"> 
          {attackPart}
        </div>
        
      </div>
    );
  
  },

  // style the card based on if it has attacked, is castable, etc
  cssClassesForCard: function() {
    let cssClassCanPlay = '';
    if (this.props.cardInfo.cost > this.props.player.mana) {
      cssClassCanPlay = "too-expensive";
    }
    let cssClass = window.game.localPlayer().selectedCard == this.props.cardInfo ||
                   window.game.remotePlayer().selectedCard == this.props.cardInfo ? 
                   'playing-card active-card' : 'playing-card';
    let fromIndex = window.game.localPlayer().board.indexOf(this.props.cardInfo);    
    let cssClassCanAct = !this.props.cardInfo.canAct && fromIndex != -1 ? 
                           'has-attacked-card' : '';

    let cssClassDamage = '';
    if (this.props.cardInfo.showDamage) {
      cssClassDamage = "damage-player";
    }

    let combinedCSS = cssClass + ' ' + 
                      cssClassDamage + ' ' + 
                      cssClassCanPlay + ' ' + 
                      cssClassCanAct; 
    return combinedCSS;
  },
  
  // select cards in local player's hand or board
  selectCard: function() {
    let boardIndex = window.game.localPlayer().board.indexOf(this.props.cardInfo);
    if (boardIndex != -1) {
      let selectMove = {
                    "op": "selectCard", 
                    "index": boardIndex,
                    "containerType": "board"
                 };
      window.client.makeLocalMove(selectMove);
    }

    let handIndex = window.game.localPlayer().hand.indexOf(this.props.cardInfo);
    if (handIndex != -1) {
      let selectMove = {
                    "op":"selectCard", 
                    "index":handIndex,
                    "containerType": "hand"
                 };
      window.client.makeLocalMove(selectMove);
    }

    let opponentBoardIndex = window.game.remotePlayer().board.indexOf(this.props.cardInfo);
    if (opponentBoardIndex != -1) {
      let selectMove = {
                    "op":"selectCard", 
                    "index":opponentBoardIndex,
                    "containerType": "opponentBoard"
                 };
      window.client.makeLocalMove(selectMove);
    }

  },

});

module.exports = Card;