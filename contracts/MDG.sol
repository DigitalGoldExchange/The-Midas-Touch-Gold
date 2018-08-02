pragma solidity ^0.4.24;

/**
 * Utility library of inline functions on addresses
 */
library AddressUtils {

  /**
   * Returns whether the target address is a contract
   * @dev This function will return false if invoked during the constructor of a contract,
   * as the code is not actually created until after the constructor finishes.
   * @param addr address to check
   * @return whether the target address is a contract
   */

  function isContract(address addr) internal view returns (bool) {
    uint256 size;
    // XXX Currently there is no better way to check if there is a contract in an address
    // than to check the size of the code at that address.
    // See https://ethereum.stackexchange.com/a/14016/36603
    // for more details about how this works.
    // TODO Check this again before the Serenity release, because all addresses will be
    // contracts then.
    // solium-disable-next-line security/no-inline-assembly
    assembly { size := extcodesize(addr) }
    return size > 0;
  }

}

contract ERC20Basic {
    function totalSupply() public view returns (uint256);
    function balanceOf(address who) public view returns (uint256);
    function transfer(address to, uint256 value) public returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
}

library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
    function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
        // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        c = a * b;
        assert(c / a == b);
        return c;
    }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        // uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return a / b;
    }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
    function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
        c = a + b;
        assert(c >= a);
        return c;
    }
}

/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 is ERC20Basic {

    function allowance(address owner, address spender)
        public view returns (uint256);

    function transferFrom(address from, address to, uint256 value)
        public returns (bool);

    function approve(address spender, uint256 value) public returns (bool);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

/**
 * @title Basic token
 * @dev Basic version of StandardToken, with no allowances.
 */
contract BasicToken is ERC20Basic {
    using SafeMath for uint256;

    mapping(address => uint256) balances;

    uint256 totalSupply_;

  /**
  * @dev Total number of tokens in existence
  */
    function totalSupply() public view returns (uint256) {
        return totalSupply_;
    }

  /**
  * @dev Transfer token for a specified address
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));
        require(_value <= balances[msg.sender]);

        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

  /**
  * @dev Gets the balance of the specified address.
  * @param _owner The address to query the the balance of.
  * @return An uint256 representing the amount owned by the passed address.
  */
    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }
}

/**
 * @title Standard ERC20 token
 *
 * @dev Implementation of the basic standard token.
 * https://github.com/ethereum/EIPs/issues/20
 * Based on code by FirstBlood: https://github.com/Firstbloodio/token/blob/master/smart_contract/FirstBloodToken.sol
 */
contract StandardToken is ERC20, BasicToken {

    mapping (address => mapping (address => uint256)) internal allowed;


  /**
   * @dev Transfer tokens from one address to another
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint256 the amount of tokens to be transferred
   */
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    )
    public
    returns (bool)
    {
        require(_to != address(0));
        require(_value <= balances[_from]);
        require(_value <= allowed[_from][msg.sender]);

        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        emit Transfer(_from, _to, _value);
        return true;
    }

  /**
   * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
   * Beware that changing an allowance with this method brings the risk that someone may use both the old
   * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
   * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
   * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   * @param _spender The address which will spend the funds.
   * @param _value The amount of tokens to be spent.
   */
    function approve(address _spender, uint256 _value) public returns (bool) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

  /**
   * @dev Function to check the amount of tokens that an owner allowed to a spender.
   * @param _owner address The address which owns the funds.
   * @param _spender address The address which will spend the funds.
   * @return A uint256 specifying the amount of tokens still available for the spender.
   */
    function allowance(
        address _owner,
        address _spender
    )
    public
    view
    returns (uint256)
    {
        return allowed[_owner][_spender];
    }

  /**
   * @dev Increase the amount of tokens that an owner allowed to a spender.
   * approve should be called when allowed[_spender] == 0. To increment
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param _spender The address which will spend the funds.
   * @param _addedValue The amount of tokens to increase the allowance by.
   */
    function increaseApproval(
        address _spender,
        uint256 _addedValue
    )
    public
    returns (bool)
    {
        allowed[msg.sender][_spender] = (allowed[msg.sender][_spender].add(_addedValue));
        emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
        return true;
    }

  /**
   * @dev Decrease the amount of tokens that an owner allowed to a spender.
   * approve should be called when allowed[_spender] == 0. To decrement
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param _spender The address which will spend the funds.
   * @param _subtractedValue The amount of tokens to decrease the allowance by.
   */
    function decreaseApproval(
        address _spender,
        uint256 _subtractedValue
    )
    public
    returns (bool)
    {
        uint256 oldValue = allowed[msg.sender][_spender];
        if (_subtractedValue > oldValue) {
            allowed[msg.sender][_spender] = 0;
        } else {
            allowed[msg.sender][_spender] = oldValue.sub(_subtractedValue);
        }
        emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
        return true;
    }
}

/**
 * @title MDGOwnable
 *
 * @dev Due to ownable change in zeppelin, the authorities in MDGOwnable include hiddenOwner,
 *      superOwner, owner, centerBanker, and operator. 
 *      Each authority has different roles.
 */
contract MDGOwnable {
    //변수
    address public owner;
    address public superOwner;
    address public hiddenOwner;
    address public mdgOfficialHolder;

    enum Role {owner, superOwner, hiddenOwner}
    
    //매핑
    mapping(address => bool) public operators;
    
    //이벤트
    event MDG_RoleTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    
    event MDG_RoleTransferred(
        Role indexed ownerType,
        address indexed previousOwner,
        address indexed newOwner
    );

    event MDG_SetOperator(address indexed operator); 
    event MDG_DeletedOperator(address indexed operator);

    
    //제어자
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    modifier onlyOwnerOrOperator() {
        require(msg.sender == owner || operators[msg.sender]);
        _;
    }
    
    modifier onlyMdgOfficialHolder() {
        require(msg.sender == mdgOfficialHolder);
        _;
    }

    modifier onlySuperOwner() {
        require(msg.sender == superOwner);
        _;
    }
    
    modifier onlyhiddenOwner(){
        require(msg.sender == hiddenOwner);
        _;
    }

    //생성자
    constructor() public {
        owner = msg.sender;     
        superOwner = msg.sender;
        hiddenOwner = msg.sender;
        mdgOfficialHolder = msg.sender;
        operators[owner] = true;
    }

    /**
    * @dev Set the address to operator
    * @param _operator has the ability to pause transaction, has the ability to blacklisting & unblacklisting. 
    */
    function setOperator(address _operator) external onlySuperOwner returns(bool) {
        require(_operator != address(0));

        operators[_operator] = true;
        emit MDG_SetOperator(_operator);
        return true;
    }

    /**
    * @dev Remove the address from operator
    * @param _operator has the ability to pause transaction, has the ability to blacklisting & unblacklisting. 
    */
    function delOperator(address _operator) external onlySuperOwner returns(bool) {
        require(_operator != owner);

        delete operators[_operator];
        emit MDG_DeletedOperator(_operator);
        return true;        
    }

    /**
    * @dev It is possible to hand over owner’s authority. Only superowner is available.
    */
    function transferOwnership(address newOwner) external onlySuperOwner {
        emit MDG_RoleTransferred(owner, newOwner);
        owner = newOwner;
    }

    /**
    * @dev It is possible to hand over mdgHolder’s authority. Only superowner is available.
    */
    function transferMdgSellOwnership(address newMdgHolder) external onlySuperOwner {
        emit MDG_RoleTransferred(mdgOfficialHolder, newMdgHolder);
        mdgOfficialHolder = newMdgHolder;
    }

    /**
    * @dev It is possible to hand over superOwner’s authority. Only hiddenowner is available.  
    * @param newSuperOwner  SuperOwner manages all authorities except for hiddenOwner and superOwner
    */
    function transferSuperOwnership(address newSuperOwner) public onlyhiddenOwner {
        emit MDG_RoleTransferred(Role.superOwner, superOwner, newSuperOwner);
        superOwner = newSuperOwner;
    }
    /**
    * @dev It is possible to hand over hiddenOwner’s authority. Only hiddenowner is available
    * @param newhiddenOwner NewhiddenOwner and hiddenOwner don’t have many functions, 
    * but they can set and remove authorities of superOwner and hiddenOwner.
    */
    function changeHiddenOwner(address newhiddenOwner) public onlyhiddenOwner {
        emit MDG_RoleTransferred(Role.hiddenOwner, hiddenOwner, newhiddenOwner);
        hiddenOwner = newhiddenOwner;
    }

}

/**
 * @title MDGPausable
 *
 * @dev It is used to stop trading in emergency situation
 */
contract MDGPausable is MDGOwnable {
    event MDG_Pause();
    event MDG_Unpause();

    bool public paused = false;

    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    modifier whenPaused() {
        require(paused);
        _;
    }
    /**
    * @dev Block trading. Only owner and operator are available.
    */
    function pause() onlyOwner whenNotPaused public {
        paused = true;
        emit MDG_Pause();
    }
  
    /**
    * @dev Unlock limit for trading. Owner and operator are available and this function can be operated in paused mode.
    */
    function unpause() onlyOwner whenPaused public {
        paused = false;
        emit MDG_Unpause();
    }
}

/**
 * @title MDGBlacklist
 *
 * @dev Block trading of the suspicious account address.
 */
contract MDGBlacklist is MDGOwnable {
    mapping(address => bool) blacklisted;
    
    event MDG_Blacklisted(address indexed blacklist);
    event MDG_Whitelisted(address indexed whitelist);

    modifier whenPermitted(address node) {
        require(!blacklisted[node]);
        _;
    }
    
    /**
    * @dev Check a certain node is in a blacklist
    * @param node  Check whether the user at a certain node is in a blacklist
    */
    function isPermitted(address node) public view returns (bool) {
        return !blacklisted[node];
    }

    /**
    * @dev Process blacklisting
    * @param node Process blacklisting. Put the user in the blacklist.   
    */
    function blacklist(address node) public onlyOwnerOrOperator {
        blacklisted[node] = true;
        emit MDG_Blacklisted(node);
    }

    /**
    * @dev Process unBlacklisting. 
    * @param node Remove the user from the blacklist.   
    */
    function unblacklist(address node) public onlyOwnerOrOperator {
        blacklisted[node] = false;
        emit MDG_Whitelisted(node);
    }
}

/**
 * @title HasNoEther
 */
contract HasNoEther is MDGOwnable {
    
    /**
  * @dev Constructor that rejects incoming Ether
  * The `payable` flag is added so we can access `msg.value` without compiler warning. If we
  * leave out payable, then Solidity will allow inheriting contracts to implement a payable
  * constructor. By doing it this way we prevent a payable constructor from working. Alternatively
  * we could use assembly to access msg.value.
  */
    constructor() public payable {
        require(msg.value == 0);
    }
    
    /**
   * @dev Disallows direct send by settings a default function without the `payable` flag.
   */
    function() external {
    }
    
    /**
   * @dev Transfer all Ether held by the contract to the owner.
   */
    function reclaimEther() external onlyOwner {
        owner.transfer(address(this).balance);
    }
}

/**
 * @title MDGBaseToken - Major functions such as authority setting on tockenlock are registered.
 */
contract MDGBaseToken is StandardToken, MDGPausable, MDGBlacklist, HasNoEther {
    using AddressUtils for address;

    event MDGTransfer(address indexed from, address indexed to, uint256 value, string text);
    event MDGTransferFrom(address indexed owner, address indexed spender, address indexed to, uint256 value, string text);
    event MDGApproval(address indexed from, address indexed spender, uint256 value, string text);
    
    event MDGMint(address indexed owner, address indexed to, uint256 value, string text);
    event MDGBurn(address indexed owner, address indexed from, uint256 value, string text);
    
    //mdg가 10으로 나눴을때 0으로 떨어지는가에 따라 금액을 보낼수 있고, 없음을 정한다.
    modifier mdgCalc(uint _value) {
        require(_value % 10 == 0);
        _;
    }

    /**
   * @dev 확장성을 두고, 블랙리스트를 _from, _to 모두 검사해준다. 
   */ 
    function mdgTransfer(address _to, uint _value, string _text)
    whenPermitted(msg.sender) whenPermitted(_to) mdgCalc(_value) whenNotPaused 
    public returns (bool ret){
        ret = super.transfer(_to, _value);

        emit MDGTransfer(msg.sender, _to, _value, _text);
    }
    function transfer(address _to, uint256 _value) public returns (bool ret) {
        return mdgTransfer(_to, _value, "");
    }

   /**
   * @dev 사용자가 mdg -> tmtg로 팔때, 해당 officialHolder에게는 판매가 가능해야한다. 때문에 _to가 officialHolder일 경우에는 transfer를 허용해준다. 
   * paused & unpause 모두 작동 가능해야한다.
   * 
   */   
    function mdgTransferToOfficial(uint256 _value, string _text)
    whenPermitted(msg.sender) mdgCalc(_value)
    public returns (bool ret) {       
        ret = super.transfer(mdgOfficialHolder, _value);
        
        emit MDGTransfer(msg.sender, mdgOfficialHolder, _value, _text);   
    }

    /**
   * @dev mdgOfficialHolder가 mdg -> tmtg로 주는 경우 
   * paused & unpause 모두 작동 가능해야한다.
   * 
   */
    function mdgTransferFromOfficial(address _to, uint256 _value, string _text)
    whenPermitted(_to) mdgCalc(_value) onlyMdgOfficialHolder
    public returns (bool ret) {
        require(_to != address(this));

        ret = super.transfer(_to, _value);
        emit MDGTransfer(msg.sender, _to, _value, _text);
    }

    function mdgTransferFrom(address _from, address _to, uint256 _value, string _text)
    whenPermitted(_from) whenPermitted(msg.sender) whenPermitted(_to) mdgCalc(_value) whenNotPaused 
    public returns (bool ret) {
        require(_to != address(this));

        ret = super.transferFrom(_from, _to, _value);
        emit MDGTransferFrom(_from, msg.sender, _to, _value, _text );
    }
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        return mdgTransferFrom(_from, _to, _value, "");
    }

    function mdgApprove(address _spender, uint256 _value, string _note) 
    whenPermitted(msg.sender) whenPermitted(_spender) mdgCalc(_value) whenNotPaused
    public returns (bool ret) {
        ret = super.approve(_spender, _value);
        emit MDGApproval(msg.sender, _spender, _value, _note);
    }
    function approve(address _spender, uint256 _value) public returns (bool) {
        return mdgApprove(_spender, _value, "");
    }
    

    function mdgIncreaseApproval(address _spender, uint256 _addedValue, string _text)
    public whenNotPaused whenPermitted(msg.sender) whenPermitted(_spender) mdgCalc(_addedValue)
    returns (bool ret) {
        ret =  super.increaseApproval(_spender, _addedValue);
        emit MDGApproval(msg.sender, _spender, allowed[msg.sender][_spender], _text);
    }
    function increaseApproval(address _spender, uint addedValue) public returns (bool) {
        return mdgIncreaseApproval(_spender, addedValue, "");
    } 


    function mdgDecreaseApproval(address _spender, uint256 _subtractedValue, string _text) 
    public whenNotPaused whenPermitted(msg.sender) whenPermitted(_spender) mdgCalc(_subtractedValue)
    returns (bool ret) {
        
        ret = super.decreaseApproval(_spender, _subtractedValue);
        emit MDGApproval(msg.sender, _spender, allowed[msg.sender][_spender], _text);
    }
    function decreaseApproval(address _spender, uint _subtractedValue) public returns (bool) {
        
        return mdgDecreaseApproval(_spender, _subtractedValue, "");
    }


    function mdgMint(address _to, uint _amount, string _text)
    mdgCalc(_amount) onlyOwnerOrOperator
    public returns (bool ret) {
        ret = _mint(_to, _amount);
        
        emit MDGMint(msg.sender, _to, _amount, _text);

    }
    function _mint(address _to, uint _amount) internal returns (bool) {
        require(_to != address(0x0));

        totalSupply_ = totalSupply_.add(_amount);
        
        balances[_to] = balances[_to].add(_amount);

        emit Transfer(address(0), _to, _amount);
        return true;
    }    


    function mdgBurn(address _who, uint _value, string _text)
    mdgCalc(_value) onlyOwnerOrOperator
    public returns (bool ret) {
        ret = _burn(_who, _value);

        emit MDGBurn(msg.sender, _who, _value, _text);
    } 
    function _burn(address _who, uint256 _value) internal returns(bool) {
        require(_value <= balances[_who]);

        balances[_who] = balances[_who].sub(_value);
        totalSupply_ = totalSupply_.sub(_value);

        emit Transfer(_who, address(0), _value);
        return true;
    }
    
    
    function reclaimToken() external onlyOwner {
        transfer(owner, balanceOf(this));
    }
    
    function destory() onlyhiddenOwner public {
        selfdestruct(superOwner);
    } 
}

contract MDG is MDGBaseToken {
    using AddressUtils for address;

    string public constant name = "Midas Digital Gold";
    string public constant symbol = "MDG";
    uint8 public constant decimals = 0;
    
    bytes4 internal constant MDG_RECEIVED = 0xe6947557;

    constructor() public {
        totalSupply_ = 0;
        balances[msg.sender] = 0;
        emit Transfer(0x0, msg.sender, 0);
        paused = true;
    }

    function postTransfer(address owner, address spender, address to, uint value, MDGReceiver.MDGReceiveType ntype)
    internal returns (bool) {
        if (!to.isContract()) return true;

        //
        bytes4 ret = MDGReceiver(to).onMDGReceived(owner, spender, value, ntype);
        return (ret == MDG_RECEIVED);
    }

    function mdgTransfer(address to, uint value, string text) public returns (bool ret) {
        ret = super.mdgTransfer(to,value,text);
        require(postTransfer(msg.sender,msg.sender,to,value, MDGReceiver.MDGReceiveType.MDG_TRANSFER));
    }

    function mdgTransferFrom(address from, address to, uint value, string text) public returns (bool ret) {
        ret = super.mdgTransferFrom(from, to, value, text);
        require(postTransfer(from, msg.sender, to, value, MDGReceiver.MDGReceiveType.MDG_TRANSFER));
    }

    function mdgMint(address to, uint256 amount, string text) public  returns (bool ret) {
        ret = super.mdgMint(to, amount, text);
        require(postTransfer(0x0, msg.sender, to, amount, MDGReceiver.MDGReceiveType.MDG_MINT));
    }

    function mdgBurn(address _who, uint _value, string _text)  public returns (bool ret) {
        ret = super._burn(_who, _value);
        require(postTransfer(0x0, msg.sender, _who, _value, MDGReceiver.MDGReceiveType.MDG_BURN));
        emit MDGBurn(msg.sender, _who, _value, _text);
    } 
}

contract MDGReceiver {
    bytes4 internal constant MDG_RECEIVED = 0xe6947557;
    enum MDGReceiveType { MDG_TRANSFER, MDG_MINT, MDG_BURN }

    function onMDGReceived(address owner, address spender, uint256 value, MDGReceiveType ntype) public returns (bytes4);
    
}

contract MDGDapp is MDGReceiver {
    event LogOnReceiveMDG(string message, address indexed owner, address indexed spender, uint256 value, MDGReceiveType receiveType);
    
    function onMDGReceived(address owner, address spender, uint256 value, MDGReceiveType receiveType) public returns (bytes4) {

        emit LogOnReceiveMDG("I received Coin.", owner, spender, value, receiveType);
        
        return MDG_RECEIVED; // must return this value if successful
    } 
}