import React from "react";
import Header from "./Header";
import NotFound from "./NotFound";
import { Route, Switch } from "react-router-dom";
import { deleteCard, deleteDeck} from "../utils/api/index";
import { useHistory} from "react-router-dom/cjs/react-router-dom.min";
import HomeDisplay from "./HomeDisplay";
import DeckDisplay from "./DeckDisplay";


function Layout() {
  const history = useHistory();

  // handles all click events (not including submit) on every page baced off their id and name
const ClickHandeler =(event)=>{
  const deckId = event.target.value;
  const cardId = event.target.id;
  const name = event.target.name;

  //if the button is a navigational it navigates to the correct page
  if(name!=="delete"){
      if(cardId==="0"){
          history.push(`/decks/${deckId}${name}`)
      }else{
          history.push(`/decks/${deckId}/cards/${cardId}${name}`)
      }

  //if the button is a delete button it deletes baced off of if its a card or Deck (CD);
  }else{
      const abortController = new AbortController();
      if(cardId==="0"){
          try{
              deleteDeck(deckId,abortController.signal);
          }catch(error){
              if(error.name="AbortError"){
                  console.log("aborted");
              }else{throw error};
          }
      }else{
          try{
              deleteCard(cardId,abortController.signal);
          }catch(error){
              if(error.name="AbortError"){
                  console.log("aborted");
              }else{throw error};
          }
      }
  }
}

  return (
    <div>
      <Header />
      <div className="container">
        <Switch>
          //if at home page this displays
          <Route exact path="/">
            <HomeDisplay ClickHandeler={ClickHandeler} />
          </Route>
          
          //if on a deck page of any kind this displays
          <Route path="/decks/:deckId">
            <DeckDisplay ClickHandeler={ClickHandeler}/>
          </Route>
          
          //if page not found this displays
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default Layout;
