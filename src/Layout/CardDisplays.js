import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import {Switch, Route, useRouteMatch, useParams, useHistory} from "react-router-dom/cjs/react-router-dom.min";
import { readCard, updateCard } from "../utils/api";

function CardDisplys({deck}){
    const [newFormData, setNewFormData]= useState({front:"",back:""})
    const [editFormData, setEditFormData]= useState({front:"",back:"", deckId:"",id:''})
    const {url} =useRouteMatch();
    const cardId = useParams().cardId
    const history = useHistory();

    useEffect(()=>{
        const abortController = new AbortController();
        async function loadEditFormData(){
            try{
                await readCard(cardId).then((value)=>{console.log(value);setEditFormData({
                    front:value.front,
                    back:value.back,
                    id:value.id,
                    deckId:value.deckId
                })});
            }catch(error){
                if(error.name =="AbortError"){
                    console.log("Aborted")
                }else{
                    throw error;
                }
            }
        }
        if(cardId!=="new"){
            console.log("editForm");
            loadEditFormData();
        }
        return abortController.abort();
    },[])

    const EditSubmitHandeler=(event)=>{
        const updatedCard ={front:editFormData.front,back:editFormData.back,id:cardId};
        updateCard(updatedCard);
    }
    const EditChangeHandeler=(event)=>{
        const text = event.target.value;
        setEditFormData({...editFormData,[event.target.name]:text})
    }

    const NewSubmitHandeler=(event)=>{
        const newCard ={front:newFormData.front,back:newFormData.back};
        updateCard(newCard);
    }
    const NewChangeHandeler=(event)=>{
        const text = event.target.value;
        setNewFormData({...newFormData,[event.target.name]:text})
    }

    const cancelClickHandler =(event)=>{
        setEditFormData({front:"",back:"",deckId:'',id:''})
        setNewFormData({front:"",back:""});
        history.push("/");
    }
    return(<div><Switch>
        <Route exact path={`${url}/edit`}>
            <div className="NavBar">
                <Link to="/">Home</Link>/
                <Link to={`/decks/${deck.id}`}>{deck.name}</Link>/Edit Card {cardId}
            </div>
            <h1>Edit Card</h1>
            <form onSubmit={EditSubmitHandeler}>
                <label htmlFor="front">Front:</label>
                <textarea name="front" id="front" onChange={EditChangeHandeler} value={editFormData.front}></textarea>
                <label htmlFor="back">Back:</label>
                <textarea name="back" id="back" onChange={EditChangeHandeler} value={editFormData.back}></textarea>
                <button onClick={cancelClickHandler}>Cancel</button>
                <button type="submit">Submit</button>
            </form>
        </Route>
        <Route path={`${url}`}>
            <div className="NavBar">
                <Link to="/">Home</Link>/
                <Link to={`/decks/${deck.id}`}>{deck.name}</Link>/ Add Card
            </div>
            <div><h1>{deck.name}: </h1><h1>Add Card</h1></div>
            <form onSubmit={NewSubmitHandeler}>
                <label htmlFor="front">Front:</label>
                <textarea name="front" id="front" onChange={NewChangeHandeler} value={newFormData.front}></textarea>
                <label htmlFor="back">Back:</label>
                <textarea name="back" id="back" onChange={NewChangeHandeler} value={newFormData.back}></textarea>
                <button onClick={cancelClickHandler}>Cancel</button>
                <button type="submit">Submit</button>
            </form>
        </Route>
        </Switch></div>)
}
export default CardDisplys;