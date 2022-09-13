import React from "react";
import { ConnectButton } from "web3uikit";
import { NavLink } from "reactstrap";

const Navbar = () => {
  return (
    <>
      <nav>
        <div className="flex items-center justify-between px-3 py-2 border-b-2">
          <div className="">
            <h3 className="text-2xl bold ">NFTMarketplace</h3>
          </div>
          <div className="flex space-x-6  font-sans ">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/sell">SellNft</NavLink>
          </div>
          <div className="">
            <ConnectButton moralisAuth={false} />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
