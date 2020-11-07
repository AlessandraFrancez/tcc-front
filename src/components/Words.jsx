import React from 'react';
import { Form, Button, Modal, FormText, Alert, Badge, ToggleButton, ToggleButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Api from '../Api';
import { Component } from 'react';
import { If, IfComponent, Else } from 'react-statements-components';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FcIdea } from 'react-icons/fc';

import '../App.css';
import './Words.css';

class Words extends Component {
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

    this.FetchNextItem = this.FetchNextItem.bind(this);
    this.SaveWord = this.SaveWord.bind(this);
  }

  componentWillMount() {
    let { wordList } = this.state;

    if (wordList.length === 0) {
      wordList = Api({
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
    const { wordList } = this.state;

    if (wordList.length < 3) {
      const ids = [];
      wordList.forEach(item =>
        ids.push(item.id));

      Api({
        method: 'post',
        url: '/fixWords/getWords',
        headers: { 'content-type': 'application/json' },
        data: { ids }
      }).then((res) => {
        const moreItems = [...wordList, ...res.data];
        this.setState({ wordList: moreItems });
      });
    }
  }

  FetchNextItem() {
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

  render() {

    const { wordList, wordCorrection } = this.state;
    let currentWord = { text: '' };

    if (wordList.length > 0) {
      currentWord = wordList[0];
    }

    return (
      <React.Fragment>
        <div className="row">
          <Modal.Dialog size="lg" className="leftModal" >
            <Modal.Header>
              <Modal.Title>Correção de palavras</Modal.Title>
            </Modal.Header>
            <IfComponent>
              <If test={wordList.length > 0 && currentWord && currentWord.word}>
                <div className='wordsModal'>
                  <IfComponent>
                    <If test={currentWord.type === 'repeated'}>
                      <div className="rows">
                        <OverlayTrigger
                          key='tooltip1'
                          placement='right'
                          overlay={
                            <Tooltip id={'tooltip-1'}>Esta palavra foi selecionada pois possui mais de 3 caracteres repetidos.</Tooltip>
                          }>
                          <div>

                            <Alert variant="info" style={{ 'textAlign': 'center', width: 'fit-content', margin: '0 auto' }}> <Badge variant="info">Caracteres repetidos</Badge>
                              {currentWord.word} </Alert>
                          </div>
                        </OverlayTrigger>
                      </div>
                    </If>
                    <Else>
                      <div className="rows">
                        <OverlayTrigger
                          key='tooltip2'
                          placement='right'
                          overlay={
                            <Tooltip id={'tooltip-2'}>Esta palavra foi identificada como traduzida incorretamente.</Tooltip>
                          }>
                          <div>

                            <Alert variant="info" style={{ 'textAlign': 'center', width: 'fit-content', margin: '0 auto' }}> <Badge variant="warning">Tradução incorreta</Badge>
                              {currentWord.word} </Alert>
                          </div>
                        </OverlayTrigger>
                      </div>
                    </Else>
                  </IfComponent>
                  <Form.Group controlId="correction">
                    <br />
                    <Badge variant="secondary">1</Badge><Form.Label>É possível corrigir esta palavra?</Form.Label>
                    <div className="yesNoButtons">
                      <ToggleButtonGroup
                        name="fixable"
                        type="radio"
                        value={wordCorrection.ignore}
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


                  <IfComponent>
                    <If test={wordCorrection.ignore && wordCorrection.clicked}>
                      <Form.Group controlId="reason">
                        <br />
                        <Badge variant="secondary">2</Badge><Form.Label>Por que não?</Form.Label>
                        <div className="boxOfChecks">
                          {['Não é uma palavra', 'É um nome próprio', 'Não entendi o que a palavra quer dizer', 'Já está escrita corretamente'].map((type) => (
                            <div key={type} className="mb-3">
                              <Form.Check
                                type='radio'
                                id={type}
                                label={type}
                                value={wordCorrection.reason}
                                name="companyOptions"
                                onChange={e => {
                                  wordCorrection.reason = e.currentTarget.id;
                                  this.setState({ wordCorrection });
                                }}
                                checked={wordCorrection.reason === type}
                              />
                            </div>
                          ))}
                        </div>
                      </Form.Group>
                    </If>
                  </IfComponent>

                </div>
                <Modal.Footer>
                  <Button
                    variant={!wordCorrection.replacement && !wordCorrection.ignore ? "secondary" : "success"}
                    className="modalFooter"
                    onClick={this.SaveWord}
                    disabled={!wordCorrection.replacement && !wordCorrection.ignore}
                  >Enviar</Button>
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
          <Modal.Dialog size="lg" className="rightModal">
            <Modal.Header>
              <Modal.Title>Dicas</Modal.Title>
            </Modal.Header>
            <Modal.Body className="dicas">
              <FcIdea /> Qualquer variação de risada deve ser substituída por "haha" <br />
              <FcIdea /> Gritos (ex: aaaaaa) podem virar "oh" <br />
              <FcIdea /> Algumas coisas são difíceis de traduzir, nesse caso pode passar pra próxima <br />
              <FcIdea /> Não esqueça dos acentos! <br />
              <FcIdea /> Não se preocupe com a capitalização <br />
            </Modal.Body>

          </Modal.Dialog>
        </div>
      </React.Fragment>
    );
  }
}

export default Words;
