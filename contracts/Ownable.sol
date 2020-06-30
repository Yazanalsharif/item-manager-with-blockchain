pragma solidity ^0.6.4;


contract Ownable {
   address payable owner;
   constructor () public {
       owner = msg.sender;
   }
   modifier onlyOwner {
      require(owner == msg.sender, "you are not the owner");
       _;
   }
   function isOwnar() public view returns(bool) {
       return owner == msg.sender;
   }
}