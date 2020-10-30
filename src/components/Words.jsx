import React from 'react';
import '../App.css';
import { Form, Button, Modal, FormText, Alert, Badge, Row, Col, ToggleButton, ToggleButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Api from '../Api';
import { Component } from 'react';
import { If, IfComponent, Else } from 'react-statements-components';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const { wordCorrection, wordList } = this.state;
    const ids = [];
    wordList.forEach(item =>
      ids.push(item.id));

    Api({
      method: 'post',
      url: '/fixWords/saveWord',
      data: { data: wordCorrection, ids }
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
      </React.Fragment>
    );
  }
}

export default Words;
