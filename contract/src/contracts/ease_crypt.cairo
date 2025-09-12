use starknet::ContractAddress;
#[starknet::interface]
pub trait IEaseCrypt<ContractState> {
    fn withdraw(
        ref self: ContractState,
        token: ContractAddress,
        recipient_address: ContractAddress,
        amount: u256,
    ) -> bool;
    fn check_balance(
        self: @ContractState, token: ContractAddress, address: ContractAddress,
    ) -> u256;
    fn get_owner(self: @ContractState) -> ContractAddress;
}

#[starknet::contract]
pub mod EaseCrypt {
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess};
    use starknet::{
        ContractAddress, contract_address_const, get_caller_address, get_contract_address,
    };
    use super::IEaseCrypt;

    #[storage]
    struct Storage {
        owner: ContractAddress,
        reentrancy_guard: bool,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        WithdrawalCompleted: WithdrawalCompleted,
    }

    #[derive(Drop, starknet::Event)]
    struct WithdrawalCompleted {
        sender: ContractAddress,
        token: ContractAddress,
        amount: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        let ZERO_ADDRESS: ContractAddress = contract_address_const::<'0x0'>();
        assert(owner != ZERO_ADDRESS, 'Invalid owner address');
        self.owner.write(owner);
    }

    #[abi(embed_v0)]
    impl WalletImpl of IEaseCrypt<ContractState> {
        fn withdraw(
            ref self: ContractState,
            token: ContractAddress,
            recipient_address: ContractAddress,
            amount: u256,
        ) -> bool {
            assert(!self.reentrancy_guard.read(), 'Reentrancy detected');
            self.reentrancy_guard.write(true);
            let ZERO_ADDRESS: ContractAddress = contract_address_const::<'0x0'>();

            assert(token != ZERO_ADDRESS, 'Invalid token address');
            assert(recipient_address != ZERO_ADDRESS, 'Invalid recipient address');
            assert(amount > 0, 'Amount must be positive');

            let caller = get_caller_address();
            let owner: ContractAddress = self.owner.read();
            assert(caller == owner, 'Unauthorized: Not Owner');

            let erc20_dispatcher = IERC20Dispatcher { contract_address: token };
            let contract_balance = erc20_dispatcher.balance_of(get_contract_address());
            assert(contract_balance >= amount, 'Insufficient contract balance');

            let success = erc20_dispatcher.transfer(recipient_address, amount);
            assert(success, 'ERC20 transfer failed for token');

            self.emit(WithdrawalCompleted { sender: caller, token, amount });
            self.reentrancy_guard.write(false);
            true
        }

        fn check_balance(
            self: @ContractState, token: ContractAddress, address: ContractAddress,
        ) -> u256 {
            let ZERO_ADDRESS: ContractAddress = contract_address_const::<'0x0'>();
            assert(token != ZERO_ADDRESS, 'Invalid token address');
            assert(address != ZERO_ADDRESS, 'Invalid address');
            let erc20_dispatcher = IERC20Dispatcher { contract_address: token };
            erc20_dispatcher.balance_of(address)
        }

        fn get_owner(self: @ContractState) -> ContractAddress {
            self.owner.read()
        }
    }
}
