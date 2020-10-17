import React, { useState } from 'react';
import './App.css';
import Person from './Person/Person'
import UserOutput from './UserOutput/UserOutput'
import UserInput from './UserInput/UserInput'
import person from './Person/Person';
import Axios from 'axios';

const app = props => {
  const [userName, setUserName] = useState('myName')
  const [showPerson, setShowPerson] = useState(false);
  const [peopleSt, setPeople] = useState({
    people: [
      { id: 1, name: 'Max' },
      { id: 2, name: 'Joana' },
      { id: 3, name: 'Alice' },
      { id: 4, name: 'Bob' },
      { id: 5, name: 'Charles' }
    ]
  })

  const style = {
    backgroundColor: 'white',
    font: 'inherit',
    border: '1px solid blue',
    padding: '8px',
    cursor: 'pointer'
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
        <UserInput change={changeUserNameHandler} name={userName} />
        <UserOutput userName={userName} />
        <UserOutput userName='different Name' />
        <UserOutput userName='yet another name' />
      </div>)
  }

  const nameChangeHandler = (event, id) => {
    let people = peopleSt.people
    const index = people.findIndex(p => {
      return p.id === id
    });
    const person = { ...peopleSt.people[index] }
    person.name = event.target.value;

    people[index] = person;
    setPeople({ people });
  }

  const deletePersonHandler = (index) => {
    let people = [...peopleSt.people]
    people.splice(index, 1)
    setPeople({ people })
  }

  let listPeople = null
  if (showPerson) {
    listPeople =
      <div>
        {peopleSt.people.map((person, index) => {
          return (<div>
            <Person
              key={person.id}
              name={person.name}
              click={() => { deletePersonHandler(index) }}
              change={(event) => nameChangeHandler(event, person.id)}
            />
          </div>)
        })
        }
      </div>
  }

  const astyle = {
    margin: 'auto',
    fontFamily: 'sans-serif',
    backgroundColor: "lightgrey",
    border: "1px solid darkgrey",
    borderRadius: "8px",
    maxWidth: "600px",
    padding: "5px",
    position: "relative"
  }

  const radioStyle = {
    textAlign: "left",
    padding: "4px"
  }

  return (
    <div className="App" style={{ textAlign: "center" }}>
      <h1>Avaliação de Tweets</h1>
      <div style={{ border: "1px dotted lightgray", width: "fit-content", display: "inline-block", borderRadius: "8px" }}>
        <div style={{ padding: "20px" }}>
          <p style={astyle}>Não adianta nada a vivo me dar 5gb a mais de internet se ela consome até com os dados móveis desligado, vou voltar pra Nextel isso sim</p>
        </div>
        <div style={{ position: "relative", display: "inline-block" }}>
          <form style={{ padding: "2px" }}>
            <div className="radio" style={radioStyle}>
              <label>
                <input type="radio" value="preço" checked={true} />
            Preço
          </label>
            </div>
            <div className="radio" style={radioStyle}>
              <label>
                <input type="radio" value="cobertura" />
            Cobertura
          </label>
            </div>
            <div className="radio" style={radioStyle}>
              <label>
                <input type="radio" value="serviço" />
            Serviço
          </label>
            </div>
            <div className="radio" style={radioStyle}>
              <label>
                <input type="radio" value="outro" />
            Outro:
          </label>
              <input type="text" name="other_reason" style={{ marginLeft: "5px" }} />
            </div>
          </form>
        </div>
        <div style={{padding:"10px"}}>
          <button style={{margin:"10px"}}>Anterior</button>
          <button style={{margin:"10px"}}>Enviar</button>
          <button style={{margin:"10px"}}>Próximo</button>
        </div>
      </div>
    </div>
  );
}

export default app;
