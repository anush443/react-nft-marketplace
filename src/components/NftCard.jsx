import React, { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import basicNftAbi from "../constants/BasicNft.json";

const NftCard = ({
  marketplaceAddress,
  nftAddress,
  price,
  seller,
  tokenId,
}) => {
  const [imageUri, setImageUri] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { isWeb3Enabled } = useMoralis();
  const { runContractFunction: getTokenUri } = useWeb3Contract({
    abi: basicNftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });
  const updateUI = async () => {
    const tokenUri = await getTokenUri();
    if (tokenUri) {
      const requestUrl = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenUriResponse = await (await fetch(requestUrl)).json();
      console.log(tokenUriResponse);
      const imageURI = tokenUriResponse["image"];
      const imageUriUrl = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageUri(imageUri);
      setName(tokenUriResponse.name);
      setDescription(tokenUriResponse);
    }
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);
  return <></>;
};

export default NftCard;
