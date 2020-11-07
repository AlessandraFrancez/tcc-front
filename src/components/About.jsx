import React from 'react';
import { Modal, Table, Button, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Api from '../Api';
import { toast } from 'react-toastify';
import { Component } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import '../App.css';
import './css/About.css'

class About extends Component {
  constructor() {
    super();
    this.state = {
      stats: {},
      feedback: '',
      canSendFeedback: true
    };
    this.SaveFeedback = this.SaveFeedback.bind(this);
  }

  componentWillMount() {
    Api({
      method: 'get',
      url: '/stats',
      headers: { 'content-type': 'application/json' }
    }).then((res) => {
      this.setState({ stats: res.data });
    });

  }

  SaveFeedback() {

    let { feedback } = this.state;

    feedback = this.handleUserInput(feedback);

    Api({
      method: 'post',
      url: '/feedback/',
      data: { feedback }
    }).then(res => {
      this.setState({ canSendFeedback: false, feedback });
    });
  }

  handleUserInput(text) {

    if (text.match(/[<>\\]/g)) {
      text.match(/[<>\\]/g).forEach((element) => {
        text = text.replace(element, '');
      });

      toast.warn('Caracteres não permitidos foram removidos', { size: 3 }, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    return text;
  }

  render() {

    const { stats } = this.state;
    let { feedback, canSendFeedback } = this.state;

    console.log(feedback, canSendFeedback);

    return (
      <div style={{ textAlign: 'center' }}>
        <Modal.Dialog className='aboutContainer'>
          <Modal.Header>
            <Modal.Title>Estatísticas</Modal.Title>
          </Modal.Header>
          <br />
          <Table bordered hover borderless className='table'>
            <tbody className='tableItem'>
              <tr className='tableItem'>
                <td className='tableItem'><b>Tweets analisados</b> </td>
                <td className='tableItem'>{`${stats.fetched} / ${stats.total}`}</td>
              </tr>
              <tr className='tableItem'>
                <td className='tableItem'><b>Palavras catalogadas</b> </td>
                <td className='tableItem'>{`${stats.replacedWords} / ${stats.wordsTotal}`}</td>
              </tr>
            </tbody>
          </Table>
          <span style={{ textAlign: 'right', marginRight: '10px', fontSize: 'smaller' }}>Última atualização: {stats.lastUpdate}</span>
          <hr />
        </Modal.Dialog>

        <Modal.Dialog className='aboutContainer' size='lg'>
          <Modal.Header>
            <Modal.Title>Sobre o trabalho</Modal.Title>
          </Modal.Header>
          <br />
          <div className='text'>
            O objetivo deste trabalho é determinar a viabilidade de se criar um sistema simples e fácil de configurar capaz de identificar insatisfação em comentários no Twitter de forma completamente automática com o mínimo de desenvolvimento de código. Para isso, usamos alguns módulos da IBM Watson, que realizam a tradução e a análise de sentimento dos tweets.
          </div>
          <hr />
          <img className='img' src='metodo.jpeg' alt="Método de obtenção de dados"></img>
          <Button style={{ maxWidth: 'fit-content', margin: '0 auto' }}
            onClick={() => { window.open('https://drive.google.com/file/d/1T34HVlIhnbqolqY75UYNrIgZQtnKEwkN/view?usp=sharing') }}
          >Se quiser saber ainda mais, pode ler o nosso artigo clicando aqui</Button>
          <br />
        </Modal.Dialog>

        <Modal.Dialog className='aboutContainer' size='lg'>
          <Modal.Header>
            <Modal.Title>Feedback</Modal.Title>
          </Modal.Header>
          <br />
          <div className='text'>
            Achou interessante? Tem alguma coisa que você gostaria de compartilhar? Manda pra gente!
          </div>
          <hr />
          <FormControl
            as="textarea"
            aria-label="Feedback"
            value={feedback}
            onChange={e => {
              feedback = e.target.value;
              this.setState({ feedback });
            }}
            disabled={!canSendFeedback}
            style={{ maxWidth: '90%', margin: "0 auto" }}
            maxLength="1500"
          />
          <br />
          <Modal.Footer>
            <Button
              variant={!canSendFeedback || !feedback ? "secondary" : "success"}
              className="modalFooter"
              onClick={this.SaveFeedback}
              disabled={!canSendFeedback || feedback.length === 0}
            >Enviar</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    );
  }
}

export default About;
