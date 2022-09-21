import React from "react";
import basicNftAbi from "../constants/BasicNft.json";
import NftMarketplace from "../constants/NftMarketplace.json";
import networkMapping from "../constants/networkMapping.json";
import { ethers } from "ethers";
import Navbar from "../components/Navbar";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { Form, useNotification } from "web3uikit";

const Sell = () => {
  const { chainId } = useMoralis();
  const chainIdString = chainId ? parseInt(chainId) : "31337";

  const marketplaceAddress = networkMapping[chainIdString]["NftMarketplace"][0];
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

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mt-16 mx-auto px-4 py-2 bg-slate-500 rounded-xl">
        <Form
          className="mx-auto"
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
      </div>
    </>
  );
};

export default Sell;
