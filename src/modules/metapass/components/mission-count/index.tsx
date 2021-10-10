import React, { FC } from 'react';
import { Col, Row } from 'antd';
import parse from 'html-react-parser';

import nftImage from './assets/nft.png';

import './index.scss';

interface props {
  totalNFTs: number;
  totalAttributes: number;
  mission: number;
}

const CountComponent: FC<props> = props => {
  return (
    <>
      <Row className="count-component-container">
        <Col xs={24} sm={24} md={8} lg={10} xl={10} className="count-holder">
          <p className="count">{props.totalNFTs}k</p>
          <p className="message">NFTs</p>
        </Col>
        <Col xs={24} sm={24} md={8} lg={4} xl={4} className="count-holder">
          <p className="count">{props.totalAttributes}</p>
          <p className="message">Attributes</p>
        </Col>
        <Col xs={24} sm={24} md={8} lg={10} xl={10} className="count-holder">
          <p className="count">{props.mission}</p>
          <p className="message">Mission</p>
        </Col>
      </Row>
    </>
  );
};

export default CountComponent;
