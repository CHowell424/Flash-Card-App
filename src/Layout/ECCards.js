import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom/cjs/react-router-dom.min";
import { createCard, readCard, updateCard } from "../utils/api";

function ECCards({edit=false, deck}){
    const [formData, setFormData]= useState({front:"",back:"",deckId:0, cardId:0});
    const history = useHistory();
    const deckId = useParams().deckId;
    const cardId = useParams().cardId;
    let path = "Add Card";
    let ec = <h1></h1>

    useEffect(()=>{
        const abortController = new AbortController();
        
        async function loadEditCard(){
            try{
                console.log("hello")
                await readCard(cardId).then((value)=>{console.log(value);setFormData({
                    front:value.front,
                    back:value.back,
                    id:value.id,
                    deckId:value.deckId
                })});
            }catch(error){
                if(error.nam==="AbortError"){
                    console.log("aborted")
                }else{
                    throw(error);
                }
            }
        }
        if(edit){
            loadEditCard();
        }
        return abortController.abort();
    },[])

    const cancelClickHandler=(event)=>{
        setFormData({front:"",back:"",deckId:0, cardId:0});
        history.push(`/decks/${deckId}`)
    }

    const ChangeHandeler =(event)=>{
        const area = event.target.name;
        const text = event.target.value;
        setFormData({...formData,[area]:text});
    }

    const SubmitHandeler=(event)=>{
        event.preventDefault();
        const abortController = new AbortController();
        let necard={front:formData.front, back:formData.back}
        if(edit){
            necard={front:formData.front, back:formData.back,id:formData.id, deckId:formData.deckId};
            console.log(necard);
            updateCard(necard, abortController.signal);
            setFormData({})
            history.push(`/`)
        }else{
            createCard(deck.id,necard, abortController.signal);
            setFormData({})
            history.push(`/`)
        }
    }
    

        if(edit){ec = <h1>Edit Card</h1>
        ;path=`edit card ${formData.id}`;}


    return(<div>
        <div className="NavBar">
            <Link to="/">Home</Link>/
            <Link to={`/decks/${deck.id}`}>{deck.name}</Link>/{path}
        </div>
            {ec}
            <form onSubmit={SubmitHandeler}>
                <label htmlFor="front">Front:</label>
                <textarea name="front" id="front" onChange={ChangeHandeler} value={formData.front}></textarea>
                <label htmlFor="back">Back:</label>
                <textarea name="back" id="back" onChange={ChangeHandeler} value={formData.back}></textarea>
                <button onClick={cancelClickHandler}>Cancel</button>
                <button type="submit">Submit</button>
            </form>
    </div>)
}

export default ECCards;