import React from "react";
import { useMoralisQuery } from "react-moralis";
import NftCard from "./NftCard";

const Listings = () => {
  const {
    data: nftListings,

    isLoading: fecthingNfts,
  } = useMoralisQuery("ActiveItem", (query) =>
    query.limit(10).descending("tokenId")
  );

  return (
    <>
      <div className="container mx-auto">
        <div className="flex flex-col items-center mt-16 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          {fecthingNfts ? (
            <div>Loading...</div>
          ) : (
            nftListings.map((nft) => {
              const { marketplaceAddress, nftAddress, price, seller, tokenId } =
                nft.attributes;
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
          )}
        </div>
      </div>
    </>
  );
};

export default Listings;
