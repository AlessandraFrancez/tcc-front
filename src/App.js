import React, { useState } from 'react';
import './App.css';
import Person from './Person/Person'
import UserOutput from './UserOutput/UserOutput'
import UserInput from './UserInput/UserInput'

const app = props => {
  const [ peopleSt, setPeople] = useState({
    people:[
      {name: 'Max'},
      {name: 'Joana'},
      {name: 'Alice'},
      {name: 'Bob'},
      {name: 'Charles'}
    ] 
  })

  const [userName, setUserName] = useState('myName')

  const [showPerson, setShowPerson] = useState(false);

  const switchNameHandler = (newName) => {
    setPeople({
      people:[
        {name: newName},
        {name: 'Andrea'}
      ] })
  }

  const nameChangeHandler = (event) => {
    setPeople({
      people:[
        {name: 'Max'},
        {name: event.target.value}
      ] })
  }

  const style = {
    backgroundColor: 'white',
    font: 'inherit',
    border: '1px solid blue',
    padding: '8px',
    cursor:'pointer'
  }

  const changeUserNameHandler = (event) => {
    setUserName(event.target.value);
  }

  const toggleHandler = () => {
    setShowPerson(!showPerson)
  }

  let persons = null;
  if (showPerson) {
    persons = (<div >
      <UserInput change={changeUserNameHandler} name={userName}/>
      <UserOutput userName={userName}/>
      <UserOutput userName='different Name'/>
      <UserOutput userName='yet another name'/>
    </div>)
  }
  return (
    <div className="App">
      <h1>Hi, I'm a React App</h1>
      <button style={style} onClick={switchNameHandler.bind(this, 'Maxi')}>Switch name</button>
      <button style={style} onClick={toggleHandler}>Toggle visibility</button>
      <p>This is a paragraph</p>
      <Person name={peopleSt.people[0].name} click={switchNameHandler.bind(this,'Not Max')} nameChange={nameChangeHandler}/>
      <Person name={peopleSt.people[1].name} nameChange={nameChangeHandler}>Extra text</Person>
      {persons}
      <div></div>
    </div>
    // React.createElement('div', {className: 'App'}, React.createElement('h1', null, 'Does this work now?'))
  );
}

export default app;
