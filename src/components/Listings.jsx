import React from "react";
import { useMoralisQuery, useMoralis } from "react-moralis";
import NftCard from "./NftCard";

const Listings = () => {
  const { isWeb3Enabled } = useMoralis();
  const { data: nftListings, isLoading: fecthingNfts } = useMoralisQuery(
    "ActiveItem",
    (query) => query.limit(10).descending("tokenId")
  );

  return (
    <>
      <div className="container mx-auto px-4 py-2 ">
        <h1>Recently Listed</h1>

        <div className="flex flex-col items-center mt-16 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          {isWeb3Enabled ? (
            fecthingNfts ? (
              <div>Loading...</div>
            ) : (
              nftListings.map((nft) => {
                const {
                  marketplaceAddress,
                  nftAddress,
                  price,
                  seller,
                  tokenId,
                } = nft.attributes;
                return (
                  <>
                    <NftCard
                      marketplaceAddress={marketplaceAddress}
                      nftAddress={nftAddress}
                      price={price}
                      seller={seller}
                      tokenId={tokenId}
                      key={tokenId}
                    />
                  </>
                );
              })
            )
          ) : (
            "Connect to chain"
          )}
        </div>
      </div>
    </>
  );
};

export default Listings;
