pragma solidity ^0.6.4;

import "./ItemManager.sol";

contract Item {
    uint public index;
    uint public ItemPrice;
    uint public isPaid;
    
    ItemManager parentContract;
    
    
    constructor(ItemManager _parent, uint _price, uint _index) public {
        parentContract = _parent;
        ItemPrice = _price;
        index = _index;
    }
    
    receive() external payable {
        require(ItemPrice == msg.value, "not fully paid");
        require(isPaid == 0, "the already paid");
        isPaid = msg.value;
        
        (bool sucsses, ) = address(parentContract).call.value(msg.value)(abi.encodeWithSignature("triggerPayment(uint256)", index));
        
        require(sucsses, "the transaction is falid ,is canseld");
 
    }
    
    
    
    
}