import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory, useParams, Link } from "react-router-dom/cjs/react-router-dom.min";
import { createDeck, deleteCard, deleteDeck, readDeck, updateDeck } from "../utils/api";
import ECCards from "./ECCards";

function DeckDisplay(){
    const [formData, setFormData]=useState({name:"", description:""});
    const [editFormData, setEditFormData]=useState({name:"", description:""});
    const history = useHistory();
    const [deck, setDeck]=useState({name:"",id:"",description:"",cards:[{front:"",back:""}]})
    const deckId = useParams().deckId;
    const [cardDeck, setCardDeck]= useState([[]])
    const[studyDeslpay, setStudyDesplay]= useState();
    const [cardNumber, setCardNumber]= useState(0);
    const [fb, setFb]=useState("front");

    const ClickHandeler =(event)=>{
        const deckID = event.target.name;
        const cardID = event.target.id;
        const value= event.target.value;
        if(cardID==="0"){
            history.push(`/decks/${deckID}${value}`)
        }else{
            history.push(`/decks/${deckID}/cards/${cardID}${value}`)
        }
    }

    const deleteHandler =(event)=>{
        if(window.confirm(`Are you sure you want to delete ${event.target.name}`)){
            const deckID = event.target.id;
            deleteDeck(deckID)
            history.push("/")
        }
      }
    const deleteHandler2 =(event)=>{
        if(window.confirm(`Are you sure you want to delete ${event.target.name}`)){
            const cardID= event.target.id;
            deleteCard(cardID)
            history.push(`/decks/${deckId}`);
        }
      }

    const SubmitHandeler=(event)=>{
        event.preventDefault()
        const abortController = new AbortController();
        const newDeck = {name:formData.name,description:formData.description};
        try{
            createDeck(newDeck,abortController.signal);
        }catch(error){
            if(error.name==="AbortError"){
                console.log("Aborted")
            }else{
                throw error;
            }
        }
        setFormData({name:"", description:""});
        history.push("/")
    }

    const changeHandeler =(event)=>{
        const text = event.target.value;
        setFormData({...formData,[event.target.name]:text});
    }

    const NewCardHandler=(event)=>{
        history.push(`/decks/${deckId}/cards/new`);
    }

    const cancelHandeler=(event)=>{
        history.push(`/`);
    }

    const nextController =(event)=>{
        if(cardNumber<deck.cards.length-1){
            setCardNumber(cardNumber+1)
            setFb("front");
        }else{
            if(window.confirm("Restart Cards?")){
                setFb("front")
                setCardNumber(0);
            }else{
                history.push("/");
            }
        }
    }

    let nextButton = <button id="next" key ="next" onClick={nextController} name="next" >next</button>


    const flipController =(event)=>{
        if(fb=="front"){
            setFb("back")
            setStudyDesplay(
                <div>
                    <p>card {cardNumber+1} of {deck.cards.length}</p>
                    <p>{deck.cards[cardNumber].back}</p>
                    <button name="flip" id="flip" key ="flip" onClick={flipController}>flip</button>
                    {nextButton}
                    {/*<button id="next" onClick={nextController} name="next">Next</button>*/}
                </div>
                );
        }else{
            setFb("front")
            
        }
    }
    
    const EditSubmitHandeler=(event)=>{
        event.preventDefault()
        const abortController = new AbortController();
        const updatedDeck = {name:editFormData.name,description:editFormData.description, id:deckId};
        try{
            updateDeck(updatedDeck,abortController.signal);
        }catch(error){
            if(error.name==="AbortError"){
                console.log("Aborted")
            }else{
                throw error;
            }
        }
        setEditFormData({name:"", description:""});
        history.push(`/decks/${deckId}`);
    }
    
    const editChangeHandeler=(event)=>{
        const text = event.target.value;
        setEditFormData({...editFormData,[event.target.name]:text});
    }

    useEffect(()=>{
        const abortController = new AbortController();
        async function loadDeck(){
            try{
                await readDeck(deckId,abortController.signal).then((value)=>{setDeck(value);loadCardDeck(value.cards);loadEditForm(value)});
            }catch(error){
                if(error.name==="AbortError"){
                    console.log("Aborted")
                }else{throw error}
            }
        }

        async function loadCardDeck(cards){
            let l1 =[]
            let list = [];
            let front =<div></div>
            let back= <div></div>
            try{
                for(let n=0; n<cards.length;n++){
                    front =(<div>
                        <p>{cards[n].front}</p>
                        <button onClick={flipController}>Flip</button>
                    </div>)
                    back = (<div>
                        <p>{cards[n].back}</p>
                        <button onClick={flipController}>Flip</button>
                        <button onClick={nextController}>Next</button>
                    </div>)
                    list = [front,back];
                    l1.push(list);
                    await setCardDeck(l1);
                }
            }catch(error){
                if(error.name==="AbortError"){console.log("Aborted")}else{throw error};
            }

        }
        async function loadEditForm(deck){
            setEditFormData({
                name:deck.name,
                description:deck.description
            })
        }
        if(deckId!== "new"){
            loadDeck();
        }
        return ()=>abortController.abort();
    },[])

    useEffect(()=>{
        if(deck.cards.length>=3){
        if(fb=="front"){
            setStudyDesplay(
                <div>
                    <p>card {cardNumber+1} of {deck.cards.length}</p>
                    <p>{deck.cards[cardNumber].front}</p>
                    <button onClick={flipController} id="flip" name="flip">flip</button>
                </div>
                );
        }else{
            setStudyDesplay(
                <div>
                    <p>card {cardNumber+1} of {deck.cards.length}</p>
                    <p>{deck.cards[cardNumber].back}</p>
                    <button name="flip" id="flip" key ="flip" onClick={flipController}>flip</button>
                    {nextButton}
                    {/*<button id="next" onClick={nextController} name="next">Next</button>*/}
                </div>
                );
        }}else{
            setStudyDesplay((<div>
                <h3>Not enough cards.</h3>
                <p>You need at least 3 cards to study. This deck has {deck.cards.length} cards.</p>
                <button onClick={NewCardHandler}>+ Create Card</button>
                </div>))
        }
    }, [cardDeck, cardNumber, fb])
    
    return<div>
        <Switch>
            <Route exact path="/decks/new">
            <div className="">
                <Link to="/">Home</Link>/Create Deck
            </div>
            <h1>Create Deck</h1>
                <form onSubmit={SubmitHandeler}>
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" id="name" onChange={changeHandeler} value={formData.name}></input>
                    <label htmlFor="description" >Description:</label>
                    <textarea name="description" id="description" onChange={changeHandeler} vlaue={formData.description}></textarea>
                    <button name=" " id="" onClick={cancelHandeler}>cancel</button>
                    <button type="submit">Submit</button>
                </form>
            </Route>

            <Route exact path="/decks/:deckId">
                <div className="NavBar">
                    <Link to="/">Home</Link> / 
                    <Link to={`/decks/${deckId}`}>{deck.name}</Link>
                </div>
                <h3>{deck.name}</h3>
                <p>{deck.cards.length} cards</p>
                <p>{deck.description}</p>
                <button name={deck.id} id="0" value="/study" onClick={ClickHandeler}>Study</button>
                <button name={deck.id} id="0" value="/edit" onClick={ClickHandeler}>Edit</button>
                <button name={deck.id} id="new" value="" onClick={ClickHandeler}>+Add Card</button>
                <button id={deck.id} name={deck.name} onClick={deleteHandler}>Delete</button>
                <h3>Cards</h3>
                {deck.cards.map((card)=>{return(<div key={`${card.id} div`}>
                    <p>{card.front}</p>
                    <p>{card.back}</p>
                    <button name={deck.id} id={card.id} value="/edit" onClick={ClickHandeler}>Edit</button>
                    <button name={card.front} id={card.id} onClick={deleteHandler2}>Delete</button>
                </div>)})}
            </Route>

            <Route path="/decks/:deckId/edit">
            <div className="NavBar">
                <Link to="/">Home</Link>/
                <Link to={`/decks/${deck.id}`}>{deck.name}</Link>/Edit Deck
            </div>
            <h1>Edit Deck</h1>
            <form onSubmit={EditSubmitHandeler}>
                    <label htmlFor="name">Name:</label>
                    <textarea name="name" id="name" onChange={editChangeHandeler} value={editFormData.name}></textarea>
                    <label htmlFor="description" >Description:</label>
                    <textarea name="description" id="description" onChange={editChangeHandeler} value={editFormData.description}></textarea>
                    <button name=" " id="" onClick={cancelHandeler}>cancel</button>
                    <button type="submit">Submit</button>
            </form>
            </Route>

            <Route path="/decks/:deckId/study">
            <div className="NavBar">
                    <Link to="/">Home</Link> / 
                    <Link to={`/decks/${deckId}`}>{deck.name}</Link> / 
                    <Link to={`/decks/${deckId}/study`}>Study</Link>
                </div>
                <h1>Study: {deck.name}</h1>
                {studyDeslpay}
            </Route>

            <Route exact path="/decks/:deckId/cards/new">
                <h1>{deck.name}: </h1><h1>Add Card</h1>
                <ECCards deck={deck}/>
            </Route>
            <Route exact path="/decks/:deckId/cards/:cardId/edit">
                <ECCards edit={true} deck={deck}/>
            </Route>
        </Switch>
    </div>
}

export default DeckDisplay;