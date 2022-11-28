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
        {decks.map((deck)=>{return(<div key={`${deck.id} div`}>
            <h3 key={`${deck.id} name`}>{deck.name}</h3>
            <p key={`${deck.id} cards`}>{deck.cards.length} cards</p>
            <p key={`${deck.id} descrip`}>{deck.description}</p>
            <button key={`${deck.id} view`} value={deck.id} name="" onClick={ClickHandeler}>View</button>
            <button key={`${deck.id} study`} value={deck.id} name="/study" onClick={ClickHandeler}>Study</button>
            <button key={`${deck.id} delete`} id={deck.id} name={deck.name} onClick={deleteHandler}>Delete</button>
        </div>)})}
    </div>)
}

export default HomeDisplay;