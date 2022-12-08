import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";

import { ethers } from "ethers";
import { contractAddress as address } from "../../../config";
import axios from "axios";
import { notifyError, notifyInfo, notifySuccess } from "../../../helper";
import abi from "../../../abis/Market.json";
import { shortenAddress } from "@usedapp/core";

import { NFT__DATA } from "../../../assets/data/data";
import "./trending.css";

import NftCard from "../Nft-card/NftCard";

const Trending = () => {
  const [data, setData] = useState(NFT__DATA);

  useEffect(() => {
    loadNFTs();
  }, [data]);

  const nftInterface = new ethers.utils.Interface(abi);

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
    <section>
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <h3 className="trending__title">Trending NFTs</h3>
          </Col>
          {data.slice(0, 4).map((item, i) => (
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
  );
};

export default Trending;
