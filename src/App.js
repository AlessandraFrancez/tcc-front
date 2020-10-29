import React from 'react';
import './App.css';
import { Nav, Form, Button, Modal, FormText, Alert, ButtonGroup, Badge, Row, Col, ToggleButton, ToggleButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Api from './Api';
import { Component } from 'react';
import { If, IfComponent, Else } from 'react-statements-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SelectionHighlighter from "react-highlight-selection";
import { Switch, Route } from "react-router-dom";

class App extends Component {
  constructor() {
    super();
    this.state = {
      list: [],
      wordList: [],
      showWelcome: true,
      responses: {
        theme: false,
        translation: false,
        company: false,
        selected: [],
        clicked: false
      },
      wordCorrection: {
        replacement: '',
        ignore: false,
        clicked: false
      },
      id: false
    },
      this.WelcomeMessage = this.WelcomeMessage.bind(this);
    this.SaveQuestion = this.SaveQuestion.bind(this);
    this.FetchNextItem = this.FetchNextItem.bind(this);
    this.selectionHandler = this.selectionHandler.bind(this);
    this.setIrrelevant = this.setIrrelevant.bind(this);
    this.SaveWord = this.SaveWord.bind(this);
    this.themes = ['Atendimento', 'Cobertura', 'Cobrança', 'Preço', 'Qualidade', 'Elogio', 'Irrelevante/Sem sentido', 'Outro'];
  }

  componentWillMount() {
    let { list, wordList } = this.state;
    if (list.length === 0) {
      list = Api({
        method: 'post',
        url: '/voting/getQuestions',
        headers: { 'content-type': 'application/json' }
      }).then((res) => {
        this.setState({ list: res.data, id: res.data[0].id });
      });
    }

    if (wordList.length === 0) {
      list = Api({
        method: 'post',
        url: '/fixWords/getWords',
        headers: { 'content-type': 'application/json' }
      }).then((res) => {
        this.setState({ wordList: res.data });
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
    const { list, wordList } = this.state;

    if (prevState.list.length !== list.length) {
      this.forceUpdate();
    }

    if (list.length < 3) {
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

    if (wordList.length < 3) {
      Api({
        method: 'post',
        url: '/fixWords/getWords',
        headers: { 'content-type': 'application/json' }
      }).then((res) => {
        const moreItems = [...wordList, ...res.data];
        this.setState({ wordList: moreItems });
      });
    }
  }

  FetchNextItem(type = 'question') {

    if (type === 'question') {
      let { list, id, responses } = this.state;
      list.splice(0, 1);
      id = list[0].id;
      responses = {
        theme: false,
        translation: false,
        company: false,
        selected: [],
        clicked: false
      };
      this.setState({ list, id, responses });
      this.forceUpdate();
    } else {
      let { wordList, wordCorrection } = this.state;
      wordList.splice(0, 1);
      wordCorrection = {
        id: wordList[0].id,
        replacement: '',
        ignore: false,
        clicked: false
      };
      this.setState({ wordCorrection, wordList });
      this.forceUpdate();
    }

  }

  SaveQuestion() {

    const { responses, id } = this.state;

    Api({
      method: 'post',
      url: '/voting/saveQuestion',
      data: { data: responses, id }
    }).then(res => {
      this.FetchNextItem();
      window.scrollTo(0, 0);
    });
  }

  SaveWord() {

    const { wordCorrection } = this.state;

    Api({
      method: 'post',
      url: '/fixWords/saveWord',
      data: { data: wordCorrection }
    }).then(res => {
      this.FetchNextItem('word');
      window.scrollTo(0, 0);
    });
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

  selectionHandler(selection) {
    const { responses } = this.state;
    if (selection.selection.length > 1 && responses.selected.indexOf(selection.selection) === -1) {
      if (responses.selected) {
        responses.selected.push(selection.selection);
      } else {
        responses.selected = [selection.selection];
      }
      this.setState({ responses });
    } else if (selection.selection.length === 1) {
      toast.info('Favor selecionar palavras de no mínimo 2 caracters', { size: 3 }, {
        position: "top-right",
        autoClose: 5000,
        pauseOnHover: true
      });
    }


  }

  setIrrelevant() {
    const { responses } = this.state;
    if (responses.clicked && (!responses.theme || !responses.company)) {
      responses.theme = 'Não é sobre telecom';
      responses.company = 'Não é sobre telecom';

      this.setState({ responses });
    }
    return null;
  }

  render() {

    const { list, showWelcome, responses, wordList, wordCorrection } = this.state;
    let currentElement = { text: '' };
    let currentWord = { text: '' };

    if (list.length > 0) {
      currentElement = list[0]
    }

    if (wordList.length > 0) {
      currentWord = wordList[0];
    }

    console.log(wordList);

    console.log(wordCorrection);

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
          <Route exact path={["/", "/tweets"]} children={<React.Fragment>
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
                                  responses.clicked = true;
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
                                  responses.clicked = true;
                                  this.setState({ responses });
                                }}>
                                <ToggleButton name="consumer" value="1" variant={responses.consumer === true ? 'success' : 'primary'}>Sim</ToggleButton>
                                <ToggleButton name="consumer" value="0" variant={responses.consumer === false ? 'success' : 'primary'}>Não</ToggleButton>
                              </ToggleButtonGroup>
                            </div>
                          </Col>
                        </Row>
                      </Form.Group>
                      <IfComponent>
                        <If test={responses.consumer && responses.telecom && responses.clicked}>
                          <Form.Group controlId="formTheme">
                            <hr />
                            <div className="btn-group-justified">
                              <Badge variant="secondary">3</Badge><Form.Label>Sobre o que esse tweet está falando?</Form.Label>
                              <div className="boxOfChecks">
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
                                    <IfComponent>
                                      <If test={responses.theme === 'Outro' && type === 'Outro'}>
                                        <Form.Control
                                          placeholder="Intenção"
                                          value={responses.alternativeTheme}
                                          onChange={e => {
                                            responses.alternativeTheme = e.target.value;
                                            this.setState({ responses });
                                          }} />
                                      </If>
                                    </IfComponent>
                                  </div>
                                ))}
                              </div>

                            </div>
                          </Form.Group>
                          <Form.Group controlId="formCompany">
                            <hr />
                            <Badge variant="secondary">4</Badge><Form.Label>É possível identificar sobre quem esse tweet está falando?</Form.Label>
                            <div className="boxOfChecks">
                              {['Oi', 'Vivo', 'Tim', 'Claro', 'Nextel', 'Sercomtel', 'Algar', 'Não é possível identificar', 'Outra'].map((type) => (
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
                                  <IfComponent>
                                    <If test={responses.company === 'Outra' && type === 'Outra'}>
                                      <Form.Control
                                        placeholder="Empresa"
                                        value={responses.alternativeCompany}
                                        onChange={e => {
                                          responses.alternativeCompany = e.target.value;
                                          this.setState({ responses });
                                        }} />
                                    </If>
                                  </IfComponent>
                                </div>
                              ))}
                            </div>

                          </Form.Group>
                        </If>
                        <Else>
                          {this.setIrrelevant()}
                        </Else>
                      </IfComponent>
                      <Form.Group controlId="formTranslation">
                        <hr />
                        <Badge variant="secondary">{responses.consumer && responses.telecom && responses.clicked ? 5 : 3}</Badge><Form.Label>Realizamos uma tradução automática deste tweet, que nota você daria para ela?</Form.Label>
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
                            <Button variant="success" id='5'>Muito boa</Button>
                          </ButtonGroup>
                        </div>
                        <IfComponent>
                          <If test={responses.translation !== '5' && responses.translation}>
                            <br />
                            <Badge variant="secondary">6</Badge><Form.Label>Como não ficou muito legal, consegue selecionar pra mim no texto que palavras estão muito ruins ou não foram traduzidas?</Form.Label>
                            <Alert variant="info">
                              <SelectionHighlighter
                                text={currentElement.watsonTranslation}
                                selectionHandler={this.selectionHandler}
                                customClass="custom-class"
                              />
                            </Alert>
                            <div className="container">
                              {responses.selected.map((type) => (
                                <div key={type} className='boxOfCards'>
                                  <Alert
                                    value={type}
                                    variant='warning'
                                    dismissible
                                    size='sm'
                                    closeLabel={type}
                                    bsPrefix='dismissibleCards'
                                    onClose={(show, e) => {
                                      const span = e.currentTarget.innerHTML.toString();
                                      const secondLastIndex = span.lastIndexOf('>', span.lastIndexOf('>') - 1)
                                      const match = span.substring(secondLastIndex + 1, span.lastIndexOf("</span>"));
                                      const index = responses.selected.indexOf(match);
                                      if (index !== -1) {
                                        responses.selected.splice(index, 1);
                                      }
                                      this.setState({ responses });
                                    }}
                                  >{type}</Alert>
                                </div>
                              ))}
                            </div>
                          </If>
                        </IfComponent>
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant={!responses.translation || !responses.theme || !responses.company ? "secondary" : "success"}
                      className="modalFooter"
                      onClick={this.SaveQuestion}
                      disabled={!responses.translation || !responses.theme || !responses.company}
                    >Save</Button>
                    <Button
                      variant={!responses.translation || !responses.theme || !responses.company ? "primary" : "success"}
                      className="modalFooter"
                      onClick={this.SaveQuestion}
                      disabled={!responses.translation || !responses.theme || !responses.company}
                    >Next</Button>
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
          </React.Fragment>} />
          <Route path={"/words"} children={<React.Fragment>
            <Modal.Dialog style={{ 'min-width': '40%' }}>
              <Modal.Header>
                <Modal.Title>Correção de palavras</Modal.Title>
              </Modal.Header>
              <IfComponent>
                <If test={wordList.length > 0 && currentWord && currentWord.word}>
                  <div className='wordsModal'>
                    <IfComponent>
                      <If test={currentWord.type === 'repeated'}>
                        <div className="rows">
                          <Row>
                            <Col>
                              <OverlayTrigger
                                key='tooltip1'
                                placement='right'
                                overlay={
                                  <Tooltip id={'tooltip-1'}>Esta palavra foi selecionada pois possui mais de 3 caracteres repetidos.</Tooltip>
                                }>
                                <Badge variant="danger">Caracteres repetidos</Badge>
                              </OverlayTrigger>
                            </Col>
                            <Col>
                              <Alert variant="info" style={{ 'textAlign': 'center', width: 'fit-content', margin: '0 auto' }}> {currentWord.word} </Alert>
                            </Col>
                          </Row>

                        </div>
                      </If>
                      <Else>
                        <Form.Label>Esta palavra foi identificada como traduzida incorretamente.</Form.Label>
                      </Else>
                    </IfComponent>
                    <Form.Group controlId="correction">
                      <br />
                      <Badge variant="secondary">1</Badge><Form.Label>É possível corrigir esta palavra?</Form.Label>
                      <div className="yesNoButtons">
                        <ToggleButtonGroup
                          name="fixable"
                          type="radio"
                          value={responses.telecom}
                          className="yesNoButtons"
                          onClick={e => {
                            wordCorrection.ignore = e.target.value === '1' ? true : false;
                            wordCorrection.clicked = true;
                            this.setState({ wordCorrection });
                          }}>
                          <ToggleButton name="fixable" value="0" variant={wordCorrection.ignore === false && wordCorrection.clicked ? 'success' : 'primary'}>Sim</ToggleButton>
                          <ToggleButton name="fixable" value="1" variant={wordCorrection.ignore === true ? 'success' : 'primary'}>Não</ToggleButton>
                        </ToggleButtonGroup>
                      </div>
                      <IfComponent>
                        <If test={!wordCorrection.ignore && wordCorrection.clicked}>
                          <br />
                          <Badge variant="secondary">2</Badge><Form.Label>Nesse caso, por favor sugira uma correção</Form.Label>
                          <Form.Control type="text"
                            placeholder="Palavra"
                            value={wordCorrection.replacement}
                            onChange={e => {
                              wordCorrection.replacement = e.target.value;
                              this.setState({ wordCorrection });
                            }} />
                        </If>
                      </IfComponent>
                    </Form.Group>
                  </div>
                  <Modal.Footer>
                    <Button
                      variant={!wordCorrection.replacement && !wordCorrection.ignore ? "secondary" : "success"}
                      className="modalFooter"
                      onClick={this.SaveWord}
                      disabled={!wordCorrection.replacement && !wordCorrection.ignore}
                    >Save</Button>
                  </Modal.Footer>
                </If>
                <Else>
                  <Modal.Body>
                    <Form>
                      <FormText>Parece que já corrigimos todas as palavras. Obrigada!</FormText>
                    </Form>
                  </Modal.Body>
                </Else>
              </IfComponent>
            </Modal.Dialog>
          </React.Fragment>} />
        </Switch>
      </div>
    );
  }
}

export default App;
