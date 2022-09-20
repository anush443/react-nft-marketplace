import React, { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { Card } from "web3uikit";
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
      const imageUri = tokenUriResponse.image;
      const imageUriUrl = imageUri.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageUri(imageUriUrl);
      setName(tokenUriResponse.name);
      setDescription(tokenUriResponse.description);
    }
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);
  return (
    <>
      {imageUri && (
        <Card description={description} title={name}>
          <div>
            <img src={imageUri} alt={tokenId} className="h-[200px] w-[200px]" />
          </div>
        </Card>
      )}
    </>
  );
};

export default NftCard;
