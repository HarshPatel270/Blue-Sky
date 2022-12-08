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

const Contact = () => {
  const [data, setData] = useState([]);
  const [nfts, setNfts] = useState([]);

  const [formInput, updateFormInput] = useState({ price: "" });

  useEffect(() => {
    loadNFTs();
    loadMyNFTs();
  }, [data, nfts]);

  const nftInterface = new ethers.utils.Interface(abi);

  const handleCategory = () => {};

  const handleItems = () => {};

  async function loadNFTs() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(address, nftInterface, signer);
    const data = await contract.fetchItemsListed();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
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
  }

  const listNFTForSale = async (id, price) => {
    try {
      if (!price) return;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const priceFormatted = ethers.utils.parseUnits(price, "ether");
      let contract = new ethers.Contract(address, nftInterface, signer);

      let transaction = await contract.resellToken(id, priceFormatted);
      await notifyInfo("Please Wait", "Transaction is being processed");
      await transaction.wait();
      await notifySuccess(
        "Congratulations !",
        "You have successfully listed NFT"
      );
    } catch (error) {
      notifyError("Oops !", "Something went wrong while reselling");
      console.log(error);
    }
  };

  async function loadMyNFTs() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(address, nftInterface, signer);
    const data = await contract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
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

    setNfts(items);
  }

  return (
    <>
      <CommonSection title={"Profile"} />

      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <div className="market__product__filter d-flex align-items-center justify-content-between">
                <div className="filter__left d-flex align-items-center gap-5">
                  <div className="all__category__filter">
                    <select onChange={handleCategory}>
                      <option>Listed NFTs</option>
                    </select>
                  </div>
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
                          <p>You</p>
                        </div>

                        <div>
                          <h6>Price</h6>
                          <p>{item.price} MATIC</p>
                        </div>
                      </div>
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

      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <div className="market__product__filter d-flex align-items-center justify-content-between">
                <div className="filter__left d-flex align-items-center gap-5">
                  <div className="all__category__filter">
                    <select onChange={handleCategory}>
                      <option>Collected NFTs</option>
                    </select>
                  </div>
                </div>
              </div>
            </Col>

            {nfts.map((nft, i) => (
              <Col lg="3" md="4" sm="6" className="mb-4" key={nft.id}>
                <div className="single__nft__card">
                  <div className="nft__img">
                    <img src={nft.image} alt="" className="w-100" />
                  </div>

                  <div className="nft__content">
                    <h5 className="nft__title">
                      <div style={{ color: "white" }}>{nft.name}</div>
                    </h5>

                    <div className="creator__info-wrapper d-flex gap-3">
                      <div className="creator__info w-100 d-flex align-items-center justify-content-between">
                        <div>
                          <h6>Owned By</h6>
                          <p>You</p>
                        </div>

                        <div>
                          <h6>Price</h6>
                          <p>{nft.price} MATIC</p>
                        </div>
                      </div>
                    </div>

                    <div className=" mt-3 d-flex align-items-center justify-content-between">
                      <input
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            price: e.target.value,
                          })
                        }
                        placeholder="New price"
                        type="number"
                      />
                      <button
                        onClick={() =>
                          listNFTForSale(nft.tokenId, formInput.price)
                        }
                        className="bid__btn d-flex align-items-center gap-1"
                      >
                        <i class="ri-shopping-bag-line"></i> Resell NFTs
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

export default Contact;
