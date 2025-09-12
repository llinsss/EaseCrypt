use ease_crypt::contracts::ease_crypt::{IEaseCryptDispatcher, IEaseCryptDispatcherTrait};
use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
use snforge_std::{
    ContractClassTrait, DeclareResultTrait, declare, start_cheat_caller_address,
    stop_cheat_caller_address,
};
use starknet::{ContractAddress, contract_address_const, get_caller_address, get_contract_address};


fn deploy_contract(name: ByteArray) -> (ContractAddress, ContractAddress) {
    let admin_address: ContractAddress = contract_address_const::<'admin'>();
    let mut calldata = array![admin_address.into()];
    let contract = declare("EaseCrypt").unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@calldata).unwrap();

    // Deploy mock ERC20
    let erc20_class = declare("MyToken").unwrap().contract_class();
    let mut calldata = array![contract_address.into()];
    let (erc20_address, _) = erc20_class.deploy(@calldata).unwrap();

    (contract_address, erc20_address)
}

#[test]
fn test_withdraw() {
    let admin_address: ContractAddress = contract_address_const::<'admin'>();
    let receipent_address: ContractAddress = contract_address_const::<'recipient'>();
    let (contract_address, erc20_address) = deploy_contract("EaseCrypt");

    let dispatcher = IEaseCryptDispatcher { contract_address };

    let balance_before = dispatcher.check_balance(erc20_address, contract_address);

    start_cheat_caller_address(contract_address, admin_address);

    dispatcher.withdraw(erc20_address, receipent_address, 10);
    stop_cheat_caller_address(contract_address);

    let balance_after = dispatcher.check_balance(erc20_address, contract_address);
    assert(balance_after == (balance_before - 100), 'Invalid contract balance');

    let recepient_balance_after = dispatcher.check_balance(erc20_address, receipent_address);
    assert(recepient_balance_after == 100, 'Invalid recepient balance');
}


#[test]
#[should_panic]
fn test_fail_withdraw() {
    let receipent_address: ContractAddress = contract_address_const::<'recipient'>();
    let (contract_address, erc20_address) = deploy_contract("EaseCrypt");

    let dispatcher = IEaseCryptDispatcher { contract_address };

    start_cheat_caller_address(contract_address, receipent_address);

    dispatcher.withdraw(erc20_address, receipent_address, 100);
    stop_cheat_caller_address(contract_address);

}