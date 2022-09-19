Moralis.Cloud.afterSave("ItemListed", async function (request) {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info("Looking for confirmed tx");
  if (confirmed) {
    logger.info("Found item");
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    const activeItem = new ActiveItem();
    activeItem.set("marketplaceAddress", request.object.get("address"));
    activeItem.set("nftAddress", request.object.get("nftAddress"));
    activeItem.set("tokenId", request.object.get("tokenId"));
    activeItem.set("price", request.object.get("price"));
    activeItem.set("seller", request.object.get("seller"));
    logger.info(
      `Adding Address: ${request.object.get(
        "address"
      )} TokenId: ${request.object.get("tokenId")}`
    );
    logger.info("Saving item...");
    activeItem.save();
  }
});

Moralis.Cloud.afterSave("ItemCancelled", async function (request) {
  const confirmed = request.object.get("Confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info(`Marketplace | object:${request.object}`);
  if (confirmed) {
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    const query = new Moralis.Query("ActiveItem");
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));
    logger.info(`Marketplace | query ${query}`);
    const cancelledItem = await query.first();
    if (cancelledItem) {
      logger.info(
        `Deleting ${request.object.get(
          "tokenId"
        )} at address ${request.object.get("address")} since it was cancelled `
      );
      await cancelledItem.destroy();
    } else {
      logger.info(
        `No Item found with ${request.object.get(
          "tokenId"
        )} at address ${request.object.get("address")}`
      );
    }
  }
});
