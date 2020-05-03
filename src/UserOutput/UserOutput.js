import React from 'react';
import './UserOutput.css'



const userOutput = (props) => {
    return (
        <div className="UserOutput">
            <p>This is a paragraph and I'm {props.userName}</p>
        </div>
    )
}

export default userOutput;