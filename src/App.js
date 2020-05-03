import React, { useState } from 'react';
import './App.css';
import Person from './Person/Person'
import UserOutput from './UserOutput/UserOutput'
import UserInput from './UserInput/UserInput'
import person from './Person/Person';

const app = props => {
  const [ peopleSt, setPeople] = useState({
    people:[
      {id: 1, name: 'Max'},
      {id: 2, name: 'Joana'},
      {id: 3, name: 'Alice'},
      {id: 4, name: 'Bob'},
      {id: 5, name: 'Charles'}
    ] 
  })

  const [userName, setUserName] = useState('myName')

  const [showPerson, setShowPerson] = useState(false);

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
    persons = (
    <div>
      <UserInput change={changeUserNameHandler} name={userName}/>
      <UserOutput userName={userName}/>
      <UserOutput userName='different Name'/>
      <UserOutput userName='yet another name'/>
    </div>)
  }

  const nameChangeHandler = (event, id) => {
    let people = peopleSt.people
    const index = people.findIndex(p => {
      return p.id === id
    });
    const person = {...peopleSt.people[index]}
    person.name = event.target.value;

    people[index] = person;
    setPeople({people});
  }

  const deletePersonHandler = (index) => {
    let people = [...peopleSt.people]
    people.splice(index,1)
    setPeople({people})
  }

  let listPeople = null
  if (showPerson){
    listPeople = 
    <div>
      {peopleSt.people.map((person, index) => {
        return (<div>
        <Person 
          key={person.id}
          name={person.name}
          click={() => {deletePersonHandler(index)}} 
          change={(event) => nameChangeHandler(event, person.id)}
        />
        </div>)
      })
      }
    </div>
  }

  return (
    <div className="App">
      <h1>Hi, I'm a React App</h1>
      <button style={style} onClick={toggleHandler}>Toggle visibility</button>
      <p>This is a paragraph</p>
      {listPeople}
      {persons}
    </div>
  );
}

export default app;
