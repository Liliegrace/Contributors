const contractAddress = "0x20096bD2c511689e9476b5B1C71Ec52add25e6D3";
const ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "contributorId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "ContributorCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "contributorId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "FundsContributed",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contributorId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "contributeFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contributorId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "createContributor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contributorId",
        "type": "uint256"
      }
    ],
    "name": "getContributor",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "contributionCount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lastContributionTime",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isRegistered",
            "type": "bool"
          }
        ],
        "internalType": "struct Contributors.Contributor",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const ConnectBtn = document.getElementById("connectBtn");
const DisconnectBtn = document.getElementById("disconnectBtn");

let contract;
let signer;

async function connectWallet() {
  if(!window.ethereum){
    alert("Install Metamask!");
    return;
  } 

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  const network = await provider.getNetwork();
  if(network.chainId !== 97){
      alert("You must connect to BSC Testnet to continue");
      return;
  }

  signer = await provider.getSigner();

  ConnectBtn.style.display = "none";
  DisconnectBtn.style.display = "block";

 contract = new ethers.Contract(contractAddress, ABI, signer);
 if(!contract){
  alert("Contract was not found");
  return;
}

}

function disconnectWallet(){
  window.location.reload();
}

async function addContributor() {
  console.log("We are insde the add contributor function");

  const id = document.getElementById("contributorId").value;
  const name = document.getElementById("name").value;
  const tx = await contract.createContributor(id, name);
  
  const result = await tx.wait();

  document.getElementById("txHash").textContent = result.transactionHash;
}


async function addContribution() {
  const id = document.getElementById("contributorId").value;
  const amount = document.getElementById("amount").value;
  const tx = await contract.contributeFunds(id, amount);

  const result = await tx.wait();
}


async function viewContributor() {
  const id = document.getElementById("contributorId").value;
  const contributor = await contract.getContributor(id);

  document.getElementById("contributorIdResult").innerHTML = contributor.id + 
  contributor.name + " has contributed " + contributor.amount + " BNB" + 
  contributor.contributionCount + " times" + contributor.lastContributionTime + " ";
}


ConnectBtn.addEventListener("click", connectWallet);
DisconnectBtn.addEventListener("click", disconnectWallet);
