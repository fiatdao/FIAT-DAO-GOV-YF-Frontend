import React, { FC } from 'react';
import { Col, Row } from 'antd';

import Button from 'components/antd/button';

import jumbotronImage from './assets/jumbotron.png';

import s from './s.module.scss';

const JumbotronComponent: FC = () => {
  return (
    <div className={s.jumbotronContainer}>
      <div className="content-container">
        <Row className={s.jumbotronRow} align="middle">
          <Col xs={24} md={10}>
            <div className={s.jumbotronMyNFTsContainer}>
              <p className="h1-bold">EnterDAO NFT</p>
              <p className={s.wearSuitsHeading}>THEY WEAR SUITS, SO WE DON'T HAVE TO.</p>
              <Button className={s.myNFTsButton} type="primary" onClick={() => {}}>
                My NFTs
              </Button>
            </div>
          </Col>
          <Col xs={24} md={14} className={s.jumbotronImageContainer}>
            <img src={jumbotronImage} alt="jumbotron"></img>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default JumbotronComponent;
