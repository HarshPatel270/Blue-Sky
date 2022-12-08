import React, { useState, useEffect } from "react";

import CommonSection from "../components/ui/Common-section/CommonSection";

import { ethers } from "ethers";
import { contractAddress as address } from "../config";
import axios from "axios";
import { notifyError, notifyInfo, notifySuccess } from "../helper";
import abi from "../abis/Market.json";
import { shortenAddress } from "@usedapp/core";

import { NFT__DATA } from "../assets/data/data";

import { Container, Row, Col } from "reactstrap";

import "../styles/market.css";

const Market = () => {
  const [data, setData] = useState(NFT__DATA);

  useEffect(() => {
    loadNFTs();
  }, [data]);

  const nftInterface = new ethers.utils.Interface(abi);

  const handleCategory = () => {};

  const handleItems = () => {};

  const loadNFTs = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(address, nftInterface, provider);
    const data = await contract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        console.log(tokenUri);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setData(items);
  };

  // ====== SORTING DATA BY HIGH, MID, LOW RATE =========
  const handleSort = (e) => {
    const filterValue = e.target.value;

    if (filterValue === "high") {
      const filterData = NFT__DATA.filter((item) => item.currentBid >= 6);

      setData(filterData);
    }

    if (filterValue === "mid") {
      const filterData = NFT__DATA.filter(
        (item) => item.currentBid >= 5.5 && item.currentBid < 6
      );

      setData(filterData);
    }

    if (filterValue === "low") {
      const filterData = NFT__DATA.filter(
        (item) => item.currentBid >= 4.89 && item.currentBid < 5.5
      );

      setData(filterData);
    }
  };

  const buyNft = async (nft) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(address, nftInterface, signer);

      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });
      await notifyInfo("Please wait !", "Transaction being processed");
      await transaction.wait();
      await notifySuccess("Congratulations !", "You have purchased NFT");
      loadNFTs();
    } catch (error) {
      await notifyError("Oops !", "Something went wrong while buying");
      console.log(error);
    }
  };

  return (
    <>
      <CommonSection title={"MarketPlace"} />

      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <div className="market__product__filter d-flex align-items-center justify-content-between">
                <div className="filter__left d-flex align-items-center gap-5">
                  <div className="all__category__filter">
                    <select onChange={handleCategory}>
                      <option>All Categories</option>
                      <option value="art">Art</option>
                      <option value="music">Music</option>
                      <option value="domain-name">Domain Name</option>
                      <option value="virtual-world">Virtual World</option>
                      <option value="trending-card">Trending Cards</option>
                    </select>
                  </div>

                  <div className="all__items__filter">
                    <select onChange={handleItems}>
                      <option>All Items</option>
                      <option value="single-item">Single Item</option>
                      <option value="bundle">Bundle</option>
                    </select>
                  </div>
                </div>

                <div className="filter__right">
                  <select onChange={handleSort}>
                    <option>Sort By</option>
                    <option value="high">High Rate</option>
                    <option value="mid">Mid Rate</option>
                    <option value="low">Low Rate</option>
                  </select>
                </div>
              </div>
            </Col>

            {data.map((item, i) => (
              <Col lg="3" md="4" sm="6" className="mb-4" key={item.id}>
                <div className="single__nft__card">
                  <div className="nft__img">
                    <img src={item.image} alt="" className="w-100" />
                  </div>

                  <div className="nft__content">
                    <h5 className="nft__title">
                      <div style={{ color: "white" }}>{item.name}</div>
                    </h5>

                    <div className="creator__info-wrapper d-flex gap-3">
                      <div className="creator__info w-100 d-flex align-items-center justify-content-between">
                        <div>
                          <h6>Created By</h6>
                          <p>
                            {shortenAddress(
                              item.seller
                                ? item.seller
                                : ethers.constants.AddressZero
                            )}
                          </p>
                        </div>

                        <div>
                          <h6>Price</h6>
                          <p>{item.price} MATIC</p>
                        </div>
                      </div>
                    </div>

                    <div className=" mt-3 d-flex align-items-center justify-content-between">
                      <button
                        onClick={() => buyNft(item)}
                        className="bid__btn d-flex align-items-center gap-1"
                      >
                        <i class="ri-shopping-bag-line"></i> Buy NFTs
                      </button>
                    </div>
                  </div>
                </div>

                {/*
                <NftCard
                  title={item.name}
                  description={item.description}
                  price={item.price}
                  seller={item.seller}
                  id={i}
                  tokenId={item.tokenId}
                  imageUrl={item.image}
                />
            */}
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Market;
