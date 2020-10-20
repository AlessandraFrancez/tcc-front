import React from 'react';
import './App.css';
import { Nav, Form, Button, Modal, FormText, Alert, ButtonGroup, Badge, Row, Col, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Api from './Api';
import { Component } from 'react';
import { If, IfComponent, Else } from 'react-statements-components';
import { toast } from 'react-toastify';

class App extends Component {
  constructor() {
    super();
    this.state = {
      list: [],
      showWelcome: true,
      responses: {
        theme: false,
        translation: false,
        company: false
      },
      id: false
    }
    this.WelcomeMessage = this.WelcomeMessage.bind(this);
    this.SaveQuestion = this.SaveQuestion.bind(this);
    this.FetchNextItem = this.FetchNextItem.bind(this);
    this.themes = ['Atendimento', 'Cobertura', 'Cobrança', 'Preço', 'Qualidade', 'Elogio', 'Irrelevante/Sem sentido', 'Outro'];
  }

  componentWillMount() {
    let { list } = this.state;
    if (list.length === 0) {
      list = Api({
        method: 'post',
        url: '/voting/getQuestions',
        headers: { 'content-type': 'application/json' }
      }).then((res) => {
        this.setState({ list: res.data, id: res.data[0].id });
      });
    }
  }


  handleUserInput(text) {
    if (text.match(/[<>\\]/g).forEach((element) => {
      text = text.replace(element, '');
    }));

    toast.warn('Caracteres não permitidos foram removidos', { size: 3 }, {
      position: toast.POSITION.TOP_RIGHT
    });
    return text;
  }

  componentDidUpdate(prevProps, prevState) {
    const { list } = this.state;

    if (prevState.list.length !== list.length) {
      this.forceUpdate();
    }

    if (list.length < 3) {
      console.log('Acabando..');
      Api({
        method: 'post',
        url: '/voting/getQuestions',
        headers: { 'content-type': 'application/json' },
        data: {
          ids: list.map(item => { return item.id })
        }
      }).then((res) => {
        const moreItems = [...list, ...res.data];
        this.setState({ list: moreItems });
      });
    }
  }

  FetchNextItem() {
    let { list, id, responses } = this.state;
    list.splice(0, 1);
    id = list[0].id;
    responses = {
      theme: false,
      translation: false,
      company: false
    };
    this.setState({ list, id, responses });
    this.forceUpdate();
  }

  SaveQuestion() {

    const { responses, id } = this.state;

    Api({
      method: 'post',
      url: '/voting/saveQuestion',
      data: { data: responses, id }
    }).then(res => {
      this.FetchNextItem()
    });
  }

  WelcomeMessage() {

    const { showWelcome } = this.state;
    if (showWelcome || true) {
      return (
        <Alert variant="success" onClose={() => this.setState({ showWelcome: false })} dismissible>
          <Alert.Heading>Bem vindo!</Alert.Heading>
          <p>
            Essa página foi criada para auxiliar o desenvolvimento de um trabalho de conclusão de curso de Engenharia de Produção do Cefet/RJ. Se quiser saber mais sobre o nosso trabalho, <Alert.Link href="#">clique aqui</Alert.Link>.
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

    const { list, showWelcome, responses } = this.state;
    let currentElement = { text: '' }

    if (list.length > 0) {
      currentElement = list[0]
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
          <Modal.Header>
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
                  <Form.Group controlId="formRelevancy">
                    <hr />
                    <Row>
                      <Col>
                        <Badge variant="secondary">1</Badge><Form.Label>Esse tweet é sobre uma empresa de telecomunicações?</Form.Label>
                        <div className="yesNoButtons">
                          <ToggleButtonGroup
                            name="telecom"
                            type="radio"
                            value={responses.telecom}
                            className="yesNoButtons"
                            onClick={e => {
                              responses.telecom = e.target.value === '1' ? true : false;
                              this.setState({ responses });
                            }}>
                            <ToggleButton name="telecom" value="1" variant={responses.telecom === true ? 'success' : 'primary'}>Sim</ToggleButton>
                            <ToggleButton name="telecom" value="0" variant={responses.telecom === false ? 'success' : 'primary'}>Não</ToggleButton>
                          </ToggleButtonGroup>
                        </div>
                      </Col>
                      <Col>
                        <Badge variant="secondary">2</Badge><Form.Label>Esse tweet é do ponto de vista do consumidor?</Form.Label>
                        <div className="yesNoButtons">
                          <ToggleButtonGroup
                            name="consumer"
                            type="radio"
                            value={responses.consumer}
                            className="yesNoButtons"
                            onClick={e => {
                              responses.consumer = e.target.value === '1' ? true : false;
                              this.setState({ responses });
                            }}>
                            <ToggleButton name="consumer" value="1" variant={responses.consumer === true ? 'success' : 'primary'}>Sim</ToggleButton>
                            <ToggleButton name="consumer" value="0" variant={responses.consumer === false ? 'success' : 'primary'}>Não</ToggleButton>
                          </ToggleButtonGroup>
                        </div>
                      </Col>
                    </Row>
                  </Form.Group>
                  <Form.Group controlId="formTheme">
                    <hr />
                    <div className="btn-group-justified">
                      <Badge variant="secondary">3</Badge><Form.Label>Sobre o que esse tweet está falando?</Form.Label>
                      {this.themes.map((type) => (
                        <div key={type} className="mb-3">
                          <Form.Check
                            type='radio'
                            id={type}
                            label={type}
                            name="themeOptions"
                            value={responses.theme}
                            onChange={e => {
                              responses.theme = e.currentTarget.id;
                              this.setState({ responses });
                            }}
                            checked={responses.theme === type}
                          />
                        </div>
                      ))}
                      <IfComponent>
                        <If test={responses.theme === 'Outro'}>
                          <Form.Control 
                          placeholder="Intenção" 
                          value={ responses.alternativeTheme}
                          onChange={e => {
                            responses.alternativeTheme = e.target.value;
                            this.setState({ responses });
                          }} />
                        </If>
                      </IfComponent>
                    </div>
                  </Form.Group>
                  <Form.Group controlId="formTranslation">
                    <hr />
                    <Badge variant="secondary">4</Badge><Form.Label>Realizamos uma tradução automática deste tweet, que nota você daria para ela?</Form.Label>
                    <Alert variant="info">
                      <p>
                        {currentElement.watsonTranslation}
                      </p>
                    </Alert>
                    <br />
                    <div style={{ alignSelf: 'center', textAlign: 'center' }}>
                      <ButtonGroup
                        aria-label="Basic example"
                        value={responses.translation}
                        onClick={e => {
                          responses.translation = e.target.id;
                          this.setState({ responses });
                        }}
                      >
                        <Button variant="danger" id='1'>Muito ruim</Button>
                        <Button variant="warning" id='2'>Ruim</Button>
                        <Button variant="info" id='3'>Razoável</Button>
                        <Button variant="secondary" id='4'>Boa</Button>
                        <Button variant="success" id='5'>Perfeita</Button>
                      </ButtonGroup>
                    </div>
                  </Form.Group>
                  <Form.Group controlId="formCompany">
                    <hr />
                    <Badge variant="secondary">5</Badge><Form.Label>É possível identificar sobre quem esse tweet está falando?</Form.Label>
                    {['Oi', 'Vivo', 'Tim', 'Claro', 'Algar', 'Não é possível', 'Este tweet não é sobre uma empresa de Telecom'].map((type) => (
                      <div key={type} className="mb-3">
                        <Form.Check
                          type='radio'
                          id={type}
                          label={type}
                          value={responses.company}
                          name="companyOptions"
                          onChange={e => {
                            responses.company = e.currentTarget.id;
                            this.setState({ responses });
                          }}
                          checked={responses.company === type}
                        />
                      </div>
                    ))}
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  className="modalFooter"
                  onClick={this.SaveQuestion}
                  disabled={!responses.translation || !responses.theme || !responses.company}
                >Save</Button>
                <Button variant="primary" className="modalFooter">Next</Button>
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
