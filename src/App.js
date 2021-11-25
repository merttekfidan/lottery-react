import "./App.css";
import React from "react";
import web3 from './web3'
import lottery from './lottery'
class App extends React.Component {

  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message:''
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(lottery.options.address)
    this.setState({ manager, players, balance })
  }

  onSubmit = async (event) => {
    event.preventDefault()
    const accounts = await web3.eth.getAccounts()
    this.setState({message:'Waiting on transaction success'})
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    })
    this.setState({message:'You have been entered'})
    console.log('asd')
  }
  
  onClick = async(event)=>{
    const accounts = await web3.eth.getAccounts()
    this.setState({message : 'Waiting on transaction success...'})
    await lottery.methods.pickAWinner().send({
      from:accounts[0]
    })
    this.setState({message: 'A winner has been picked'})
  }

  render() {
    web3.eth.getAccounts()
      .then(console.log)
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by : {this.state.manager}</p>
        <p>Number of players are in : {this.state.players.length}</p>
        <p>Balance of the lottery: {web3.utils.fromWei(this.state.balance, 'ether')}</p>

        <form onSubmit={this.onSubmit}>
          <div>To enter the lottery, please set a value of ether</div>
          <input
            value={this.state.value}
            onChange={event => { this.setState({ value: event.target.value }) }}
          />
          <button>Enter</button>
        </form>
        <hr />
        <h1>{this.state.message}</h1>
        <hr/>
        <h4>Ready to pick a winner ?</h4>
        <button onClick={this.onClick}>Pick A Winner</button>
      </div>
    );
  }
}
export default App;
