pragma solidity ^0.4.23;

/**
 * @title ERC20Basic
 * @dev Simpler version of ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/179 
 * remix migration 
 */

contract ERC20Basic {
    function totalSupply() public view returns (uint256);
    function balanceOf(address who) public view returns (uint256);
    function transfer(address to, uint256 value) public returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
}

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
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
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
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
  * @dev total number of tokens in existence
  */
    function totalSupply() public view returns (uint256) {
        return totalSupply_;
    } 

  /**
  * @dev transfer token for a specified address
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_to != address(0));
        require(_value <= balances[msg.sender]);

    // SafeMath.sub will throw if there is not enough balance.
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
    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }
}

/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 is ERC20Basic {
    function allowance(address owner, address spender) public view returns (uint256);
    function transferFrom(address from, address to, uint256 value) public returns (bool);
    function approve(address spender, uint256 value) public returns (bool);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

/**
 * @title Standard ERC20 token
 *
 * @dev Implementation of the basic standard token.
 * @dev https://github.com/ethereum/EIPs/issues/20
 * @dev Based on code by FirstBlood: https://github.com/Firstbloodio/token/blob/master/smart_contract/FirstBloodToken.sol
 */
contract StandardToken is ERC20, BasicToken {

    mapping (address => mapping (address => uint256)) internal allowed;

  /**
   * @dev Transfer tokens from one address to another
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint256 the amount of tokens to be transferred
   */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
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
   *
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
    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowed[_owner][_spender];
    }

 
}

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */

contract Ownable {
    address public owner;
    address public superowner;
    address public hiddenowner;
    address public centralbanker;

    mapping(address => bool) public admin;
    event SetAdmin(address indexed Admin); 
    event DeleteAdmin(address indexed Admin);
    
    event RoleTransferred(
    address indexed previousOwner,
    address indexed newOwner
    );

    function setAdmin(
        address _admin
    )
    external
    onlySuperOwner
    {
        emit SetAdmin(_admin);
        admin[_admin] = true;
    }

    function delAdmin(
        address _admin
    )
    external
    onlySuperOwner
    {
        emit DeleteAdmin(_admin);
        admin[_admin] = false;
    }
  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */

    constructor() public {
        owner = msg.sender;     
        superowner = msg.sender; 
        hiddenowner = msg.sender;
        centralbanker = msg.sender;
    }

  /**
   * @dev Throws if called by any account other than the owner.
   */

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    modifier onlyOwnerOrAdmin() {
        require(msg.sender == owner || admin[msg.sender]);
        _;
    }
    modifier onlySuperOwner() {
        require(msg.sender == superowner);
        _;
    }
    modifier onlyHiddenOwner(){
        require(msg.sender == hiddenowner);
        _;
    }
    modifier onlyNotBankOwner(){
        require(msg.sender != centralbanker);
        _;
    }
    modifier onlyBankOwner(){
        require(msg.sender == centralbanker);
        _;
    }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */

    function transferOwnership(address newOwner) public onlySuperOwner {
        emit RoleTransferred(owner, newOwner);
        owner = newOwner;
    }
    function transferBankOwnership(address newBanker) public onlySuperOwner {
        emit RoleTransferred(msg.sender, newBanker);
        centralbanker = newBanker;
    }
    /**
   * @dev Allows the current superowner to transfer control of the contract to a newsuperOwner.
   * @param newSuperOwner The address to transfer superownership to.
   */

    function transferSuperOwnership(address newSuperOwner) public onlyHiddenOwner {
        emit RoleTransferred(superowner, newSuperOwner);
        superowner = newSuperOwner;
    }
    /**
   * @dev Allows the current hidden to transfer control of the contract to a newhiddenOwner.
   * @param newHiddenOwner The address to transfer superownership to.
   */

    function transferHiddenOwnership(address newHiddenOwner) public onlyHiddenOwner {
        emit RoleTransferred(msg.sender, newHiddenOwner);
        hiddenowner = newHiddenOwner;
    }

}


/**
 * @title Burnable Token
 * @dev Token that can be irreversibly burned (destroyed).
 */
contract BurnableToken is BasicToken {

    event Burn(address indexed burner, uint256 value);

  /**
   * @dev Burns a specific amount of tokens.
   * @param _value The amount of token to be burned.
   */

    function burn(uint256 _value)  public {
        
        _burn(msg.sender, _value);
    }

    function _burn(address _who, uint256 _value) internal {
        require(_who != address(0));
        require(_value <= balances[_who]);
    // no need to require value <= totalSupply, since that would imply the
    // sender's balance is greater than the totalSupply, which *should* be an assertion failure

        balances[_who] = balances[_who].sub(_value);
        totalSupply_ = totalSupply_.sub(_value);
        emit Burn(_who, _value);
        emit Transfer(_who, address(0), _value);
    }
}


/**
 * @title Standard Burnable Token
 * @dev Adds burnFrom method to ERC20 implementations
 */
contract StandardBurnableToken is BurnableToken, StandardToken {

  /**
   * @dev Burns a specific amount of tokens from the target address and decrements allowance
   * @param _from address The address which you want to send tokens from
   * @param _value uint256 The amount of token to be burned
   */
    function burnFrom(address _from, uint256 _value) public {
        require(_value <= allowed[_from][msg.sender]);
    // Should https://github.com/OpenZeppelin/zeppelin-solidity/issues/707 be accepted,
    // this function needs to emit an event with the updated approval.
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        _burn(_from, _value);
    }
}



/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */
contract Pausable is Ownable {
    event Pause();
    event Unpause();

    bool public paused = false;
  /**
   * @dev Modifier to make a function callable only when the contract is not paused.
   */
    modifier whenNotPaused() {
        require(!paused);
        _;
    }
  /**
   * @dev Modifier to make a function callable only when the contract is paused.
   */
    modifier whenPaused() {
        require(paused);
        _;
    }
  /**
   * @dev called by the owner to pause, triggers stopped state
   */
    function pause() onlyOwnerOrAdmin whenNotPaused public {
        paused = true;
        emit Pause();
    }
  /**
   * @dev called by the owner to unpause, returns to normal state
   */
    function unpause() onlyOwnerOrAdmin whenPaused public {
        paused = false;
        emit Unpause();
    }
}


contract Blacklist is Ownable {
    mapping(address => bool) blacklisted;
    
    event Blacklisted(address indexed Blacklist);
    event Whitelisted(address indexed Whitelist);

    function blacklist(address node) public onlyOwnerOrAdmin {
        blacklisted[node] = true;
        emit Blacklisted(node);
    }

    function unblacklist(address node) public onlyOwnerOrAdmin {
        blacklisted[node] = false;
        emit Whitelisted(node);
    }

    function isPermitted(address node) public view returns(bool) {
        return !blacklisted[node];
    }
}
/**
 * @title Pausable token
 * @dev StandardToken modified with pausable transfers.
 **/
contract PausableToken is StandardToken, Pausable, Blacklist {
    
    mapping(address => bool) public investorList;
    event SetInvestor(address indexed Investor); 
    event DeleteInvestor(address indexed Investor);
    
    function setInvestor(address _addr) onlySuperOwner public {
        emit SetInvestor(_addr);
        investorList[_addr] = true;
    }
    function delInvestor(address _addr)  onlySuperOwner public {
        emit DeleteInvestor(_addr);
        investorList[_addr] = false;
    }


    function transfer(
        address _to,
        uint256 _value
    )
    public
    whenNotPaused
    returns (bool)
    {   
        if(!isPermitted(msg.sender)){
            revert();
        }
        else if(!isPermitted(_to)) {
            revert();    
        }else {
            return super.transfer(_to, _value);
        }
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    )
    public
    whenNotPaused
    returns (bool)
    {   
        if(!isPermitted(_from) || !isPermitted(_to)) {
            revert();
        }else {

            return super.transferFrom(_from, _to, _value);
        }  
    }

    function approve(
        address _spender,
        uint256 _value
    )
    public
    whenNotPaused
    returns (bool)
    {
        return super.approve(_spender, _value);
    }

}
library SafeERC20 {
    function safeTransfer(ERC20Basic token, address to, uint256 value) internal {
        require(token.transfer(to, value));
    }
}

contract CanReclaimToken is Ownable {
    using SafeERC20 for ERC20Basic;

    function reclaimToken(ERC20Basic token) external onlyOwner {
        uint256 balance = token.balanceOf(this);
        token.safeTransfer(owner,balance);
    }
}

contract HasNoEther is Ownable {
    constructor() public payable {
        require(msg.value == 0);
    }
    function() external {
    }
    function reClaimEther() external onlyOwner {
        owner.transfer(address(this).balance);
    }
}
/**
 * @title SimpleToken
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `StandardToken` functions.
 */
contract TMTG is StandardBurnableToken, PausableToken, CanReclaimToken, HasNoEther {
    string public constant name = "The Midas Touch Gold"; // solium-disable-line uppercase
    string public constant symbol = "TMTG"; // solium-disable-line uppercase
    uint256 public constant INITIAL_SUPPLY = 1e10 * (10 ** uint256(18));
    uint256 public openingTime;
    
    
    //for Initialize()
    event DGE_Initialize(address indexed _target, address indexed _desc, uint256 _value);
    
  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
    constructor()  public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
        emit Transfer(0x0, msg.sender, INITIAL_SUPPLY);
        emit DGE_Initialize(msg.sender, 0x0, totalSupply_);
        openingTime = block.timestamp;
    }

    struct investor {
        uint256 _sentAmount;
        uint256 _initialAmount;
        uint256 _limit;
    }
    event DGE_Stash(uint256 _value);
    event DGE_Unstash(uint256 _value);
    event SetCEx(address indexed CEx); 
    event DeleteCEx(address indexed CEx);
    event SetSuperInvestor(address indexed SuperInvestor); 
    event DeleteSuperInvestor(address indexed SuperInvestor);
    mapping(address => investor) public searchInvestor;
    mapping(address => bool) public superInvestor;
    mapping(address => bool) public CEx;
    
    function setCEx(
        address _CEx
    )
    external
    onlySuperOwner
    {   
        emit SetCEx(_CEx);
        CEx[_CEx] = true;
    }

    function delCEx(
        address _CEx
    )
    external
    onlySuperOwner
    {   
        emit DeleteCEx(_CEx);
        CEx[_CEx] = false;
    }

    function setSuperInvestor(
        address _super
    )
    external
    onlySuperOwner 
    {
        superInvestor[_super] = true;
        emit SetSuperInvestor(_super);
    }
    
    function delSuperInvestor(
        address _super
    )
    external
    onlySuperOwner 
    {
        superInvestor[_super] = false;
        emit DeleteSuperInvestor(_super);
    }
    
    
    function setOpeningTime() onlyOwner public {
        openingTime = block.timestamp;
    }
  
    /**
   * @dev Function that burn owner _value tokens.
   */
    function burn(uint256 _value) onlyOwner public {
        _burn(msg.sender, _value);
 
    }


    function burnFrom(address _from, uint256 _value) onlyOwner public {
        require(_value <= allowed[_from][msg.sender]);
        // Should https://github.com/OpenZeppelin/zeppelin-solidity/issues/707 be accepted,
        // this function needs to emit an event with the updated approval.
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        _burn(_from, _value);
    }

    function approve(
        address _spender,
        uint256 _value
    )
    public
    whenNotPaused
    onlyNotBankOwner
    returns (bool)
    {
        
        if(investorList[msg.sender]) {
            require(isPermitted(msg.sender));
            require(isPermitted(_spender));
            require(_newLimit.add(9 * (10 ** uint256(18))) >= searchInvestor[msg.sender]._sentAmount);
            require(_spender != address(0));
            require(balances[msg.sender] >= _value);
            require(balances[_spender].add(_value) > balances[_spender]);
            uint256 presentTime = block.timestamp;
            uint256 timeValue = presentTime.sub(openingTime);
            uint256 _result = timeValue.div(30 days);
            uint256 _newLimit = _result.mul(searchInvestor[msg.sender]._limit);
            searchInvestor[msg.sender]._sentAmount = searchInvestor[msg.sender]._sentAmount.add(_value);
            allowed[msg.sender][_spender] = _value;
            emit Approval(msg.sender, _spender, _value);
            return true;

        } else {
            require(!superInvestor[msg.sender]);
            return super.approve(_spender,_value);
        }   

    }


    function transfer(
        address _to,
        uint256 _value
    )
    public
    whenNotPaused
    onlyNotBankOwner
    returns (bool)
    {   
        if(investorList[msg.sender]) {
            require(_to != address(0));
            require(balances[msg.sender] >= _value);
            require(isPermitted(msg.sender));
            require(isPermitted(_to));
            //calculate local variables
            uint256 presentTime = block.timestamp;
            uint256 timeValue = presentTime.sub(openingTime);
            uint256 _result = timeValue.div(30 days);
            uint256 _newLimit = _result.mul(searchInvestor[msg.sender]._limit);
            require(_newLimit.add(9 * (10 ** uint256(18))) >= searchInvestor[msg.sender]._sentAmount.add(_value));
            searchInvestor[msg.sender]._sentAmount = searchInvestor[msg.sender]._sentAmount.add(_value);
            balances[msg.sender] = balances[msg.sender].sub(_value);
            balances[_to] = balances[_to].add(_value);
            emit Transfer(msg.sender, _to, _value);
            return true;
        } else {
            if (superInvestor[msg.sender]) {
                require(isPermitted(msg.sender));
                require(isPermitted(_to));
                if(!investorList[_to]){
                    investorList[_to] = true;
                    investor memory b = investor(0, _value, _value.div(10));
                    searchInvestor[_to] = b;
                }
                require(_to != address(0));
                require(_to != owner);
                require(!superInvestor[_to]);
                require(!CEx[_to]);
                require(balances[msg.sender] >= _value);
                balances[msg.sender] = balances[msg.sender].sub(_value);
                balances[_to] = balances[_to].add(_value);
                emit Transfer(msg.sender, _to, _value);
                return true;
            }
            return super.transfer(_to, _value);
        }
    }
    function getLimitPeriod() public view returns (uint) {
        uint256 presentTime = block.timestamp;
        uint256 timeValue = presentTime.sub(openingTime);
        uint256 _result = timeValue.div(30 days);
       
        return _result;
    }
    
    function stash(
        uint256 _value
    ) 
    public 
    onlyOwner
    {
        require(balances[owner] >= _value);
        balances[owner] = balances[owner].sub(_value);
        balances[centralbanker] = balances[centralbanker].add(_value);
        emit DGE_Stash(_value);        
    }

    function unstash(
        uint256 _value
    ) 
    public 
    onlyBankOwner 
    {
        require(balances[centralbanker] >= _value);
        balances[centralbanker] = balances[centralbanker].sub(_value);
        balances[owner] = balances[owner].add(_value);
        emit DGE_Unstash(_value);
    }
}
