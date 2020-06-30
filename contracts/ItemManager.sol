pragma solidity ^0.6.4;

import "./Ownable.sol";

import "./Item.sol";

contract ItemManager is Ownable{
    enum supplyChainSteps{Created, Paid, Deliverd}
    struct ItemStructure{
        Item _item;
        string _identifier;
        ItemManager.supplyChainSteps _state;
    }
    uint index;
    mapping (uint => ItemStructure) public items;
    event supplyChainStep(string indexed  _identifier, supplyChainSteps indexed _state, address indexed _item , uint index);
    function createItem(string memory _identifier, uint _price) public onlyOwner {
        Item item = new Item(this, _price, index);
        items[index]._identifier = _identifier;
        items[index]._item = item;
        items[index]._state = ItemManager.supplyChainSteps.Created;
        emit supplyChainStep(_identifier, items[index]._state, address(item), index);
         index++;
    }
    function triggerPayment(uint _index) public payable {
        require(items[_index]._state == ItemManager.supplyChainSteps.Created, "the item is not exist");
        require(address(items[_index]._item) == msg.sender, "only items can update themself");
        items[_index]._state = ItemManager.supplyChainSteps.Paid;
        emit supplyChainStep(items[_index]._identifier, items[_index]._state, address(items[_index]._item), _index);

    }
    function triggerDelivered(uint _index) public onlyOwner {
        require(items[_index]._state == ItemManager.supplyChainSteps.Paid, "the item must be paid");
        items[_index]._state = ItemManager.supplyChainSteps.Deliverd;
        emit supplyChainStep(items[_index]._identifier, items[_index]._state, address(items[_index]._item), _index);
    }
    function getNumberOfItems() public view returns(uint){
         return index;
    }
}