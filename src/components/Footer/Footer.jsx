import React from "react";

import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import "./footer.css";

import { Link } from "react-router-dom";



const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="3" md="6" sm="6" className="mb-4">
            <div className="logo">
              <h2 className=" d-flex gap-2 align-items-center ">
                <span>
                  <i class="ri-fire-fill"></i>
                </span>
                Blue Sky
              </h2>
              {/*
                          <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Voluptate, quod repellat! Quis quos dolorum tenetur fuga?
                Aspernatur rerum quae amet.
              </p>
              */}
            </div>
          </Col>

          <Col lg="3" md="6" sm="6" className="mb-4">

            <div className="social__links d-flex gap-3 align-items-center ">
              <span>
                <Link to="#">
                  <i class="ri-facebook-line"></i>
                </Link>
              </span>
              <span>
                <Link to="#">
                  <i class="ri-instagram-line"></i>
                </Link>
              </span>
              <span>
                <Link to="#">
                  <i class="ri-twitter-line"></i>
                </Link>
              </span>
              <span>
                <Link to="#">
                  <i class="ri-telegram-line"></i>
                </Link>
              </span>
              <span>
                <Link to="#">
                  <i class="ri-discord-line"></i>
                </Link>
              </span>
            </div>
          </Col>

          <Col lg="12" className=" mt-4 text-center">
            <p className="copyright"> Harsh, Vansh, Raj </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
