import React, { useEffect, useState } from "react";
import basicNftAbi from "../constants/BasicNft.json";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { Card } from "web3uikit";
import { ethers } from "ethers";
import UpdateListingModal from "./UpdateListingModal";

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
  const [showModal, setShowModal] = useState(false);
  const { isWeb3Enabled, account } = useMoralis();

  const { runContractFunction: getTokenUri } = useWeb3Contract({
    abi: basicNftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: {
      tokenId: tokenId,
    },
  });

  const userIsOwner = seller === account;
  const trucSellerAddress = userIsOwner ? "You" : seller;

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

  const handleCardClick = () => {
    userIsOwner ? setShowModal(true) : console.log("do");
  };

  const handleModalClose = () => {
    setShowModal(false);
  };
  return (
    <>
      <UpdateListingModal
        marketplaceAddress={marketplaceAddress}
        nftAddress={nftAddress}
        tokenId={tokenId}
        isVisible={showModal}
        closeModal={handleModalClose}
      />
      <div>
        {imageUri && (
          <Card
            description={description}
            title={name}
            onClick={handleCardClick}
          >
            <div className="flex flex-col items-center space-y-4 py-2 ">
              <div>#{tokenId}</div>
              <div className="text-sm">Owned by {trucSellerAddress}</div>
              <div>
                <img src={imageUri} alt={tokenId} />
              </div>
              <div>{ethers.utils.formatUnits(price, "ether")}ETH</div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default NftCard;
