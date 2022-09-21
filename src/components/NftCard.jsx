import React, { useEffect, useState } from "react";
import basicNftAbi from "../constants/BasicNft.json";
import NftMarketplace from "../constants/NftMarketplace.json";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { Card, useNotification } from "web3uikit";
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

  const { runContractFunction: buyNft } = useWeb3Contract({
    abi: NftMarketplace,
    contractAddress: marketplaceAddress,
    msgValue: price,
    functionName: "buyItem",
    params: {
      nftAddress: nftAddress,
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

    await handleSuccessOrErrorNotification(
      "info",
      `Successfully bought nft for ${ethers.utils.formatUnits(
        price,
        "ether"
      )} Eth`
    );
  };

  const handleError = async (error) => {
    console.log(error);
    handleSuccessOrErrorNotification("error", "Something went wrong");
  };

  const handleNftBuy = async () => {
    await buyNft({
      onSuccess: handleSuccess,
      onError: (error) => handleError(error),
    });
  };

  const handleCardClick = () => {
    userIsOwner ? setShowModal(true) : handleNftBuy();
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
