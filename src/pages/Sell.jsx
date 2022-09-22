import React, { useEffect, useState } from "react";
import basicNftAbi from "../constants/BasicNft.json";
import NftMarketplace from "../constants/NftMarketplace.json";
import networkMapping from "../constants/networkMapping.json";
import { ethers } from "ethers";
import Navbar from "../components/Navbar";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { Form, useNotification, CryptoCards } from "web3uikit";

const Sell = () => {
  const [sellerProceeds, setSellerProceeds] = useState("0");
  const { chainId, account, isWeb3Enabled } = useMoralis();
  const chainIdString = chainId ? parseInt(chainId) : "31337";
  console.log(account);
  const marketplaceAddress = networkMapping[chainIdString]["NftMarketplace"][0];

  const { runContractFunction: getSellerProceeds } = useWeb3Contract({
    abi: NftMarketplace,
    contractAddress: marketplaceAddress,
    functionName: "getProceeds",
    params: {
      seller: account,
    },
  });
  const { runContractFunction: withdrawSellerProceeds } = useWeb3Contract({
    abi: NftMarketplace,
    contractAddress: marketplaceAddress,
    functionName: "withdrawProceeds",
  });
  const { runContractFunction } = useWeb3Contract();

  const dispatch = useNotification();

  const handleSuccessOrErrorNotification = async (type, message) => {
    dispatch({
      type: type,
      title: "Transaction Notification",
      message: message,
      position: "topR",
      icon: "bell",
    });
  };

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    await handleSuccessOrErrorNotification("info", `Successfully listed nft`);
  };

  const handleError = async (error) => {
    console.log(error);
    handleSuccessOrErrorNotification("error", "Something went wrong");
  };

  const approveAndList = async (data) => {
    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price = ethers.utils.parseEther(data.data[2].inputResult).toString();

    const approveOptions = {
      abi: basicNftAbi,
      contractAddress: nftAddress,
      functionName: "approve",
      params: {
        to: marketplaceAddress,
        tokenId: tokenId,
      },
    };

    await runContractFunction({
      params: approveOptions,
      onSuccess: handleAprroveSuccess(nftAddress, tokenId, price),
      onError: (error) => console.log(error),
    });
  };

  const handleAprroveSuccess = async (nftAddress, tokenId, price) => {
    const listOptions = {
      abi: NftMarketplace,
      contractAddress: marketplaceAddress,
      functionName: "listItem",
      params: {
        nftAddress: nftAddress,
        tokenId: tokenId,
        price: price,
      },
    };

    await runContractFunction({
      params: listOptions,
      onSuccess: handleSuccess,
      onError: (error) => console.log(error),
    });
  };
  const handleWithdrawSuccess = async (tx) => {
    await tx.wait(1);
    await handleSuccessOrErrorNotification("info", `Withdraw all proceeds`);
  };
  const handleWithdraw = async () => {
    await withdrawSellerProceeds({
      onSuccess: handleWithdrawSuccess,
      onError: (error) => console.log(error),
    });
  };
  const updateUI = async () => {
    const proceeds = await getSellerProceeds({
      onError: (error) => console.log(error),
    });
    if (proceeds) {
      setSellerProceeds(ethers.utils.formatUnits(proceeds, "ether"));
    }
  };
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);
  return (
    <>
      <Navbar />

      <div className="mt-4 px-4 ">
        <Form
          title="List Your NFT"
          onSubmit={approveAndList}
          data={[
            {
              name: "Nft Address",
              type: "text",
              inputWidth: "50%",
              value: "",
              key: "nftAddress",
            },
            {
              name: "Token Id",
              type: "number",
              inputWidth: "50%",
              value: "",
              key: "tokenId",
            },
            {
              name: "Price",
              type: "number",
              inputWidth: "50%",
              value: "",
              key: "price",
            },
          ]}
        />
        <div>
          <CryptoCards
            bgColor="linear-gradient(113.54deg, rgba(117, 183, 251, 0.531738) 14.91%, rgba(215, 38, 243, 0.6) 42.57%, rgba(252, 84, 255, 0.336) 45.98%, rgba(209, 103, 255, 0.03) 55.76%), linear-gradient(160.75deg, #AB42CB 41.37%, #45FFFF 98.29%)"
            btnText="Withdraw Proceeds"
            chain={sellerProceeds}
            chainType="ETH"
            onClick={handleWithdraw}
          />
        </div>
      </div>
    </>
  );
};

export default Sell;
