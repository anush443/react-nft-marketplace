import React from "react";
import { useMoralisQuery } from "react-moralis";

const Listings = () => {
  const {
    data: nftListings,
    error,
    isLoading: fecthingNfts,
  } = useMoralisQuery("ActiveItem", (query) =>
    query.limit(10).descending("tokenId")
  );

  return (
    <>
      {fecthingNfts ? (
        <div>Loading...</div>
      ) : (
        nftListings.map((nft) => {
          console.log(nft.attributes);
          const { marketplaceAddress, nftAddress, price, seller, tokenId } =
            nft.attributes;
          return (
            <>
              <div> {marketplaceAddress}</div>
              <div> {nftAddress}</div>
              <div> {price}</div>
              <div> {seller}</div>
              <div> {tokenId}</div>
            </>
          );
        })
      )}
    </>
  );
};

export default Listings;
