const Moralis = require("moralis-v1/node");
require("dotenv").config();

let chainId = process.env.chainId || 31337;
let moralisChainId = chainId === "31337" ? "1337" : chainId;
const contractAddresses = require("../constants/networkMapping.json");
const contractAddress = contractAddresses[chainId]["NftMarketplace"][0];

const serverUrl = process.env.REACT_APP_SERVER_URL;

const appId = process.env.REACT_APP_APP_ID;
const masterKey = process.env.masterKey;

async function main() {
  await Moralis.start({ serverUrl, appId, masterKey });

  let itemListedOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    topic: "ItemListed(address,address,uint256,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "seller",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "ItemListed",
      type: "event",
    },
    tableName: "ItemListed",
    sync_historical: true,
  };

  let itemBoughtoptions = {
    chainId: moralisChainId,
    address: contractAddress,
    topic: "ItemBought(address,address,uint256,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "buyer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "ItemBought",
      type: "event",
    },
    tableName: "ItemBought",
    sync_historical: true,
  };

  let itemCancelledOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    topic: "ItemCanceled(address,address,uint256)",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "seller",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nftAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ItemCanceled",
      type: "event",
    },
    tableName: "ItemCancelled",
    sync_historical: true,
  };

  const listedResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemListedOptions,
    { useMasterKey: true }
  );
  const boughtResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemBoughtoptions,
    { useMasterKey: true }
  );

  const cacelledResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    itemCancelledOptions,
    { useMasterKey: true }
  );

  if (
    listedResponse.success &&
    boughtResponse.success &&
    cacelledResponse.success
  ) {
    console.log("Success! Database Updated with watching events");
  } else {
    console.log("Something went wrong...");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
