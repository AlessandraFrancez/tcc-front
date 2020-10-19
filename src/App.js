import React, { useState } from 'react';
import './App.css';
import Axios from 'axios';
import { Nav, Form, FormControl, Button, Modal, FormText, Alert, ButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Api from './Api';
import { Component } from 'react';
import { If, IfComponent, Else } from 'react-statements-components';

class App extends Component {
  constructor() {
    super();
    this.state = {
      list: [],
      showWelcome: true
    }
    this.WelcomeMessage = this.WelcomeMessage.bind(this);
  }

  componentWillMount() {
    let { list } = this.state;
    if (list.length === 0) {
      list = Api({
        method: 'get',
        url: '/voting/questions'
      }).then((res) => {
        console.log(res.data);
        this.setState({ list: res.data });
      });
    }
  }

  WelcomeMessage() {

    const { showWelcome } = this.state;
    if (showWelcome || true) {
      return (
        <Alert variant="success" onClose={() => this.setState({showWelcome: false})} dismissible>
          <Alert.Heading>Bem vindo!</Alert.Heading>
          <p>
            Essa página foi criada para auxiliar o desenvolvimento de um trabalho de conclusão de curso de Engenharia de Produção do Cefet/RJ. Se quiser saber mais sobre o nosso trabalho, <Alert.Link href="#">clique aqui</Alert.Link>.
          </p>
          <hr />
          <p className="mb-0">
            Para nos ajudar é só responder algumas perguntas sobre tweets que extraimos e analisamos utilizando inteligência artificial. O objetivo do nosso trabalho é identificar automaticamente tweets de <b>insatisfação</b> com empresas de Telecom, entãp se encontrar tweets positivos ou que não falam sobre esse assunto, não deixe de sinalizar. Obrigada!
          </p>
        </Alert>
        
      );
    }
  }

  render() {

    const { list, showWelcome } = this.state;
    let currentElement = { text: '' }

    if (list.length > 0) {
      currentElement = list[0]
      console.log(currentElement);
    }

    return (
      <React.Fragment>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">TCC  - Avaliação de Tweets</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#ranking">Ranking</Nav.Link>
          </Nav>
        </Navbar>
        <br />
        <IfComponent>
          <If test={showWelcome}>
          {this.WelcomeMessage}
          </If>
        </IfComponent>
        
        <Modal.Dialog size='xl'>
          <Modal.Header closeButton>
            <Modal.Title>Tweet</Modal.Title>
          </Modal.Header>
          <IfComponent>
            <If test={list.length > 0 && currentElement && currentElement.text}>
              <Modal.Body>
                <Form>
                  <Alert variant="info">
                    <p>
                      {currentElement.text}
                    </p>
                  </Alert>
                  <br />

                  <Form.Group controlId="formTheme">
                    <hr />
                    <Form.Label>Sobre o que esse tweet está falando?</Form.Label>
                    {['Atendimento', 'Preço', 'Qualidade', 'Lentidão', 'Indisponibilidade'].map((type) => (
                      <div key={`default-${type}`} className="mb-3">
                        <Form.Check
                          type='radio'
                          id={`default-${type}`}
                          label={type}
                        />
                      </div>
                    ))}
                  </Form.Group>
                  <Form.Group controlId="formTranslation">
                    <hr />
                    <Form.Label>Realizamos uma tradução automática deste tweet, que nota você daria para ela?</Form.Label>
                    <Alert variant="info">
                      <p>
                        {currentElement.watsonTranslation}
                      </p>
                    </Alert>
                    <br />
                    <div style={{ alignSelf: 'center', textAlign: 'center' }}>
                      <ButtonGroup aria-label="Basic example">
                        <Button variant="danger">Muito ruim</Button>
                        <Button variant="warning">Ruim</Button>
                        <Button variant="info">Razoável</Button>
                        <Button variant="secondary">Boa</Button>
                        <Button variant="success">Perfeita</Button>
                      </ButtonGroup>
                    </div>
                  </Form.Group>

                  <Form.Group controlId="formTheme">
                    <hr />
                    <Form.Label>É possível identificar sobre quem esse tweet está falando?</Form.Label>
                    {['Oi', 'Vivo', 'Tim', 'Claro', 'Algar', 'Não é possível', 'Este tweet não é sobre uma empresa de Telecom'].map((type) => (
                      <div key={`default-${type}`} className="mb-3">
                        <Form.Check
                          type='radio'
                          id={`default-${type}`}
                          label={type}
                        />
                      </div>
                    ))}
                  </Form.Group>
                </Form>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary">Close</Button>
                <Button variant="primary">Save changes</Button>
              </Modal.Footer>
            </If>
            <Else>
              <Modal.Body>
                <Form>
                  <FormText>Vou pegar alguns tweets para você analisar!</FormText>
                </Form>
              </Modal.Body>
            </Else>
          </IfComponent>
        </Modal.Dialog>
      </React.Fragment>
    );
  }
}

export default App;
