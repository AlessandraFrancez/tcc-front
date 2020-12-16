import React from "react";
import { Button, Modal, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { If, IfComponent, Else } from "react-statements-components";
import "./App.css";
// import { Nav, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// import Navbar from "react-bootstrap/Navbar";
import { Component } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { Switch, Route } from "react-router-dom";
import { Graph } from "react-d3-graph";

const myConfig = {
  automaticRearrangeAfterDropNode: true,
  nodeHighlightBehavior: true,
  collapsible: false,
  directed: true,
  width: 800,
  d3: {
    alphaTarget: 0.01,
    gravity: -30,
    linkLength: 30,
    linkStrength: 1,
    disableLinkForce: false
  },
  node: {
    color: "lightgreen",
    size: 120,
    highlightStrokeColor: "blue",
    renderLabel: true,
  },
  link: {
    highlightColor: "lightblue",
    renderLabel: true,
    labelProperty: "label",
  },
};

const onClickLink = function (source, target) {
  console.log(`Clicked link between ${source} and ${target}`);
  // const link = findLink(source, target);
  // console.log(link);
};

const onRightClickLink = function (event, source, target) {
  console.log(`Right clicked link between ${source} and ${target}`);
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        nodes: [{ id: 1 }, { id: 2 }],
        links: [{ source: 1, target: 2 }],
      },
      node: 2,
      link: 2,
      selected: 0,
      showOptions: false,
    };
  }

  onRightClickNode = (event, nodeId) => {
    nodeId = parseInt(nodeId);
    console.log(`Deleted node ${nodeId}`);
    let { data } = this.state;
    if (data.nodes.length === 1) {
      toast.warn(
        "Não é possível deletar o último nodo",
        { size: 3 },
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    } else {
      data = this.removeLinks(nodeId);
      const index = data.nodes.findIndex((node) => node.id === nodeId);
      data.nodes.splice(index, 1);
      this.setState({ data });
    }
  };

  removeLinks(nodeId, remove = false) {
    let { data } = this.state;
    data.links = data.links.filter((item) => {
      console.log(item.source, nodeId);
      if (item.source === nodeId) return false;
      if (item.target === nodeId) return false;
      return true;
    });
    console.log(data.links);
    if (remove) {
      this.setState({data});
      this.forceUpdate();
    } else {
      return data;
    }
  }

  clickPlus = (fromNode = false) => {
    let { data, node, link } = this.state;
    node++;
    link++;

    data.nodes.push({ id: node });
    if (!fromNode) {
      const lastNode = this.getLastNode();
      data.links.push({ source: lastNode.id, target: node, label: link });
    } else {
      data.links.push({ source: fromNode, target: node, label: link });
    }
    this.setState({ data, node, link });
  };

  findLink = (source, target, any = false) => {
    let { data } = this.state;
    if (any) {
      return data.links.filter(
        (item) => item.source === source || item.target === target
      );
    }
    return data.links.find(
      (item) => item.source === source && item.target === target
    );
  };

  connect(source, target) {
    this.setState({source});
    if (!target) {
      toast.info('Selecione o nodo que deseja conectar');
    }
    
    const link = { source };

  }

  onDoubleClickNode = (nodeId) => {
    console.log(`Double clicked node ${nodeId}`);
    this.clickPlus(parseInt(nodeId));
  };

  getLastNode = () => {
    let { data } = this.state;

    return data.nodes[data.nodes.length - 1];
  };

  onClickNode = (nodeId) => {
    console.log(`Clicked node ${nodeId}`);
    this.setState({ selected: parseInt(nodeId), showOptions: true });
  };

  onClickGraph = (event) => {
    this.setState({ selected: 0, showOptions: false });
};

  render() {
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
        <Row>
          <Col>
            <div>
              <Graph
                id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                data={this.state.data}
                config={myConfig}
                onClickNode={this.onClickNode}
                onDoubleClickNode={this.onDoubleClickNode}
                onRightClickNode={this.onRightClickNode}
                onClickLink={onClickLink}
                onRightClickLink={onRightClickLink}
                onClickGraph={this.onClickGraph}
              />
            </div>
          </Col>
          <Col className="optionsCol">
            <IfComponent>
              <If test={this.state.showOptions}>
                <Modal.Dialog size="sm">
                  <Modal.Header>
                    <Modal.Title>Opções</Modal.Title>
                  </Modal.Header>
                  <div style={{"padding":"20px", "margin":"auto", width:'80%'}}>
                  <Button className="yesNoButtons" onClick={() => this.clickPlus(this.state.selected)}>Adicionar novo nó</Button>
                  <Button className="yesNoButtons" onClick={() => this.clickPlus}>Ligar a um nó existente</Button>
                  <Button className="yesNoButtons" onClick={() => this.removeLinks(this.state.selected, true)}>Remover ligações</Button>
                  </div>
                </Modal.Dialog>
              </If>
            </IfComponent>
          </Col>
        </Row>
        <Button
          variant="secondary"
          className="modalFooter"
          onClick={this.clickPlus}
        >
          +
        </Button>
      </div>
    );
  }
}

export default App;
