import React from 'react';
import './Person.css'


const person = (props) => {
    return (
        <div className="Person">
            <p onClick={props.click}>I'm a person ({props.name}) and I am {Math.floor(Math.random() * 30)} years old</p>
            <p>{props.children}</p>
            <input type="text"onChange={props.nameChange} value={props.name}/>
        </div>
    )
}

export default person;