import React, { useState } from "react";
import { Modal, Input, useNotification } from "web3uikit";
import { useWeb3Contract } from "react-moralis";
import NftMarketplace from "../constants/NftMarketplace.json";
import { ethers } from "ethers";

const UpdateListingModal = ({
  marketplaceAddress,
  nftAddress,
  tokenId,
  isVisible,
  closeModal,
}) => {
  const [updatedListingPrice, setUpdatedListingprice] = useState("0");
  const [showErrorMsg, setShowErrorMsg] = useState(false);

  const { runContractFunction: updateListingPrice } = useWeb3Contract({
    abi: NftMarketplace,
    contractAddress: marketplaceAddress,
    functionName: "updateListing",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
      newPrice: ethers.utils.parseEther(updatedListingPrice).toString(),
    },
  });

  const handleUpdateListingPrice = (e) => {
    if (e.target.value <= 0) {
      setShowErrorMsg(true);
    } else {
      setUpdatedListingprice(e.target.value);
      setShowErrorMsg(false);
    }
  };

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
      `Successfully changed to ${updatedListingPrice} Eth`
    );
    closeModal();
  };

  const handleError = async (error) => {
    console.log(error);
    handleSuccessOrErrorNotification("error", "Something went wrong");
  };

  const handleUpdateListing = async () => {
    if (!showErrorMsg) {
      await updateListingPrice({
        onSuccess: handleSuccess,
        onError: (error) => handleError(error),
      });
    }
  };

  return (
    <>
      <Modal
        isVisible={isVisible}
        onCancel={closeModal}
        onCloseButtonPressed={closeModal}
        title={
          <div style={{ display: "flex", gap: 10 }}>
            Update Listing Price for tokenid #{tokenId}
          </div>
        }
        onOk={handleUpdateListing}
      >
        <div className="py-[20px]">
          <Input
            label="Eth Amt"
            type="number"
            width="100%"
            onChange={handleUpdateListingPrice}
          />
        </div>
        {showErrorMsg && (
          <div>
            <span>Eth Amount shoulfd be greater than 0</span>
          </div>
        )}
      </Modal>
    </>
  );
};

export default UpdateListingModal;
