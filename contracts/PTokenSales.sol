pragma solidity ^0.4.17;

contract PTokenSales {
    address public owner;
    string public ownname;
    
    function PTokenSales () public {
        owner = msg.sender;
        ownname = "Papan Das";
    }
  
}
