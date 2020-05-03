import React from 'react';
import './Person.css'


const person = (props) => {
    return (
        <div className="Person">
            <p>I'm a person ({props.name}) and I am {Math.floor(Math.random() * 30)} years old</p>
            <p>{props.children}</p>
            <input type="text" onChange={props.change} value={props.name}/>
            <button onClick={props.click}>Remove</button>
        </div>
    )
}

export default person;