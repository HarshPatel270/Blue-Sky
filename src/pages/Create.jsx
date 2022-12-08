import React, { useState, useEffect } from "react";

import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/ui/Common-section/CommonSection";
import NftCard from "../components/ui/Nft-card/NftCard";
import img from "../assets/images/img-01.jpg";
import avatar from "../assets/images/ava-01.png";
import { ethers } from "ethers";
import { create as ipfsClient } from "ipfs-http-client";
import { contractAddress as address } from "../config";
import abi from "../abis/Market.json";
import { Buffer } from "buffer";
import { notifyError, notifyInfo, notifySuccess } from "../helper";
import "../styles/create-item.css";

const projectId = "21XbUTxQd3BjlYJq9zjmy0czKgr";
const projectSecret = "cac4c8208574e13819906decb0299b42";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

const item = {
  id: "01",
  title: "Guard",
  desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam adipisci cupiditate officia, nostrum et deleniti vero corrupti facilis minima laborum nesciunt nulla error natus saepe illum quasi ratione suscipit tempore dolores. Recusandae, similique modi voluptates dolore repellat eum earum sint.",
  imgUrl: img,
  creator: "Trista Francis",
  creatorImg: avatar,
  currentBid: 7.89,
};

const nftInterface = new ethers.utils.Interface(abi);

const Create = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  useEffect(() => {
    setFileUrl(null);
    updateFormInput({ price: "", name: "", description: "" });
  }, []);

  const resetForm = () => {
    updateFormInput({
      price: "",
      name: "",
      description: "",
    });
  };

  const onChange = async (e) => {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://infura-ipfs.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      notifyError("Oops !", "Something went wrong while uploading");
      console.log("Error uploading file: ", error);
    }
  };

  const uploadToIPFS = async () => {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://infura-ipfs.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      notifyError("Oops !", "Something went wrong while uploading");
      console.log("Error uploading file: ", error);
    }
  };

  const listNFTForSale = async () => {
    try {
      const url = await uploadToIPFS();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const price = ethers.utils.parseUnits(formInput.price, "ether");
      let contract = new ethers.Contract(address, nftInterface, signer);

      let transaction = await contract.createToken(url, price);
      await notifyInfo("Please wait !", "Transaction being processed");
      await transaction.wait();

      await notifySuccess(
        "Congratulations !",
        "You have successfully listed NFT"
      );
      await resetForm();
    } catch (error) {
      console.log(formInput);
      console.log(error);
      await notifyError("Oops !", "Something went wrong while listing");
      await resetForm();
    }
  };

  return (
    <>
      <CommonSection title="Create Item" />

      <section>
        <Container>
          <Row>
            <Col lg="9" md="8" sm="6">
              <div className="create__item">
                <form>
                  <div className="form__input">
                    <label htmlFor="">Upload File</label>
                    <input
                      onChange={onChange}
                      type="file"
                      className="upload__input"
                    />
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Price</label>
                    <input
                      onChange={(e) =>
                        updateFormInput({ ...formInput, price: e.target.value })
                      }
                      type="number"
                      placeholder="Enter price for one item (MATIC)"
                    />
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Title</label>
                    <input
                      onChange={(e) =>
                        updateFormInput({ ...formInput, name: e.target.value })
                      }
                      type="text"
                      placeholder="Enter title"
                    />
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Description</label>
                    <input
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          description: e.target.value,
                        })
                      }
                      type="text"
                      placeholder="Enter Description"
                    />
                  </div>
                </form>

                <button onClick={() => listNFTForSale()}>List NFT</button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Create;
