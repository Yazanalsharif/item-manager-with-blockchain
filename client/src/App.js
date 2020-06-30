import React, { Component } from "react";
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import Navbar from "./view/navbar";

class App extends Component {
  state = { loaded:false, cost:100, itemName: "exampleProduct"};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      
      this.web3 = await getWeb3();
     
      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

     

      this.itemManager = new this.web3.eth.Contract(
        ItemManagerContract.abi,
        ItemManagerContract.networks[this.networkId] && ItemManagerContract.networks[this.networkId].address,
      );

      this.item = new this.web3.eth.Contract(
        ItemContract.abi,
        ItemContract.networks[this.networkId] && ItemContract.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToEventPayment();
      this.setState({loaded:true});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  

  handelInputChange = (event) => {
    const target = event.target;
    const value = target.type === "chenbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name] : value
    });
  }
  

  handleSubmit = async () => {
    const {cost, itemName} = this.state;
    const result = await this.itemManager.methods.createItem(itemName, cost).send({from:this.accounts[0]});
    console.log(result);
    const numberOfItems = await this.itemManager.methods.getNumberOfItems().call();
    console.log("the number of Item => " + numberOfItems);
    alert("the cost in wei  "+ cost+ "to theAddres  "+ result.events.supplyChainStep.returnValues._item);

    const itemInstance = new  this.web3.eth.Contract(ItemContract.abi,
       ItemContract.networks[this.networkId] && result.events.supplyChainStep.resultValues._item);
       console.log(ItemContract.networks[this.networkId]);

       console.log("the itemInstance is defined =>  ", itemInstance);
       console.log("the item manager Contract", this.itemManager);
  }

  listenToEventPayment = () => {
   this.itemManager.events.supplyChainStep().on('data', (evt) => {
     if(evt.returnValues._state === "1"){
 
         this.itemManager.methods.items(evt.returnValues.index).call().then(itemObject => {
           console.log(itemObject);
           console.log(itemObject._identifier);
           alert("the item => " + itemObject._identifier, "with index => " , evt.returnValues.index, "is paid" , " deliverd now");
           
         });
        
     }
    console.log(evt);
   })
  }
  
 
  

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      
      <div className="App">
        <Navbar/>
        <h1>simple payment / supplyChain example</h1>
        <h2>Item</h2>
        <h2>add Item</h2>
        cost in wei : <input type="text" name="cost" value={this.state.cost} onChange={this.handelInputChange}/>
         the name of item : <input type="text" name="itemName" value={this.state.itemName} onChange={this.handelInputChange}/>
         <button type="button" onClick={this.handleSubmit}>create new item</button>
         </div>
    );
  }
}

export default App;
