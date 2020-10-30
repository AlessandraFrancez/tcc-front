import React from 'react';
import './App.css';
import { Nav, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import { Component } from 'react';
import { If, IfComponent } from 'react-statements-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Switch, Route } from "react-router-dom";
import Home from './components/Home'
import Words from './components/Words.jsx';

class App extends Component {
  constructor() {
    super();
    this.state = {
      wordList: [],
      showWelcome: true,
      wordCorrection: {
        replacement: '',
        ignore: false,
        clicked: false
      },
      id: false
    }

    this.WelcomeMessage = this.WelcomeMessage.bind(this);
  }

  WelcomeMessage() {

    const { showWelcome } = this.state;
    if (showWelcome || true) {
      return (
        <Alert variant="success" onClose={() => this.setState({ showWelcome: false })} dismissible>
          <Alert.Heading>Bem vindo!</Alert.Heading>
          <p>
            Essa página foi criada para auxiliar o desenvolvimento de um trabalho de conclusão de curso de Engenharia de Produção do Cefet/RJ. Se quiser saber mais sobre o nosso trabalho, <Alert.Link href="/about">clique aqui</Alert.Link>.
          </p>
          <hr />
          <p className="mb-0">
            Para nos ajudar é só responder algumas perguntas sobre tweets que extraimos e analisamos utilizando inteligência artificial. O objetivo do nosso trabalho é identificar automaticamente tweets de <b>insatisfação</b> com empresas de Telecom, então se encontrar tweets positivos ou que não falam sobre esse assunto, não deixe de sinalizar. Obrigada!
          </p>
        </Alert>

      );
    }
  }

  render() {

    const { showWelcome } = this.state;

    return (
      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">TCC  - Avaliação de Tweets</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="about">Sobre</Nav.Link>
            <Nav.Link href="tweets">Tweets</Nav.Link>
            <Nav.Link href="words">Palavras</Nav.Link>
          </Nav>
        </Navbar>
        <br />
        <IfComponent>
          <If test={showWelcome}>
            {this.WelcomeMessage}
          </If>
        </IfComponent>
        <Switch>
          <Route exact path={["/", "/tweets"]}>
            <Home />
          </Route>
          <Route path={"/words"}>
            <Words />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
