import React from "react";
import { useMoralisQuery } from "react-moralis";
import NftCard from "./NftCard";

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
          const { marketplaceAddress, nftAddress, price, seller, tokenId } =
            nft.attributes;
          return (
            <>
              <div> {marketplaceAddress}</div>
              <div> {nftAddress}</div>
              <div> {price}</div>
              <div> {seller}</div>
              <div> {tokenId}</div>
              <NftCard
                marketplaceAddress={marketplaceAddress}
                nftAddress={nftAddress}
                price={price}
                seller={seller}
                tokenId={tokenId}
              />
            </>
          );
        })
      )}
    </>
  );
};

export default Listings;
