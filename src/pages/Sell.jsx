import React from "react";
import Navbar from "../components/Navbar";
import { Form } from "web3uikit";

const Sell = () => {
  const approveAndList = () => {};
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
