//import all dependencies
const Web3 = require("web3");
const ContractKit = require("@celo/contractkit");

//set up the network
const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
const kit = ContractKit.newKitFromWeb3(web3);

//connect to your already deployed contract
const ContractAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "purchase",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "refill",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "coffeeBalances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMachineBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const ContractAddress = "0x69a1Eb3A48575Eb3b4D07A06dEE16BCD8Cd0874D";
const contracts = new kit.web3.eth.Contract(ContractAbi, ContractAddress);

//set up your account

const PRIVATE_KEY =
  "0xa27790f81bc74d9159bb5f8c71261b8aaec6f6b0c26bed5b4fabe281cea38964"; //this is a bad practise, i only did this for simplicity

const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);

//sign transactions from our  account
kit.connection.addAccount(account.privateKey);
kit.defaultAccount = account.address;

//begin calling the functions in you smart contract

// purchase a cup of coffee
async function purchase(amount) {
  console.log("Preparing your coffee...");
  const gasPrice = await kit.web3.eth.getGasPrice();
  const celoInWei = amount && kit.web3.utils.toWei(amount.toString(), "ether");

  if (!amount || !celoInWei) {
    console.error("Invalid amount:", amount);
    return;
  }

  try {
    const tx = await contracts.methods
      .purchase(amount.toString())
      .send({
        from: account.address,
        value: celoInWei,
        gas: 200000,
        gasPrice: gasPrice,
      });
    console.log("Transaction hash:", tx.transactionHash);
    console.log("Here is your cup of Coffee.");
    console.log("Thanks for patronizing us.");
  } catch (error) {
    console.error(`Error purchasing coffee with celo value ${amount}:`, error);
  }
}

// get balance of coffee from vending machine machine
async function getMachineBalance() {
  console.log("Getting Coffee balance from machine...");
  const coffeeBalances = await contracts.methods.getMachineBalance().call();
  console.log("Transaction hash:", coffeeBalances.transactionHash);
  console.log("Coffee machine balance is ", coffeeBalances);
  return coffeeBalances;
}

// restock our coffee machine
async function refill(amount) {
  console.log("Restocking machine...");
  const gasPrice = await kit.web3.eth.getGasPrice();
  const tx = await contracts.methods
    .refill(amount)
    .send({ from: account.address, gas: 3000000, gasPrice: gasPrice });
  console.log("Transaction hash:", tx.transactionHash);
  console.log(`Coffee machine restocked with ${amount} cups of coffee`);
}

(async function () {
  await purchase(1);
  await getMachineBalance();
  await refill(100);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
