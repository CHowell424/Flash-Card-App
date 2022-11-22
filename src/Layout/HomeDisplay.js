import React, { useEffect, useState } from "react";
import { useHistory,Link } from "react-router-dom/cjs/react-router-dom.min";
import { listDecks, deleteDeck } from "../utils/api";

function HomeDisplay(){
    const [decks, setDecks]=useState([]);
    const history = useHistory()
    const [refresh, setRefresh]=useState('yes')
    const ClickHandeler = (event)=>{
        const name = event.target.name;
        const value = event.target.value;
        history.push(`/decks/${value}${name}`)
    }

    const deleteHandler =(event)=>{
        if(window.confirm(`Are you sure you want to delete ${event.target.name}`)){
            const deckID = event.target.id;
            deleteDeck(deckID)
            setRefresh("hello")
        }
      }
    
    useEffect(()=>{
        const abortController = new AbortController();
        async function loadDecks(){
            try{
                await listDecks(abortController.signal).then(setDecks);
            }catch(error){
                if(error.name==="AbortError"){
                    console.log("Aboreted")
                }else{throw error}
            }
        }
        loadDecks();
        return ()=>abortController.abort();
    },[refresh])
    return(<div>
        <div>
        <Link to="/">Home</Link>
        </div>
        <button value="new" name="" onClick={ClickHandeler}>+ Create Deck</button>
        {decks.map((deck)=>{return(<div>
            <h3>{deck.name}</h3>
            <p>{deck.cards.length} cards</p>
            <p>{deck.description}</p>
            <button value={deck.id} name="" onClick={ClickHandeler}>View</button>
            <button value={deck.id} name="/study" onClick={ClickHandeler}>Study</button>
            <button id={deck.id} name={deck.name} onClick={deleteHandler}>Delete</button>
        </div>)})}
    </div>)
}

export default HomeDisplay;