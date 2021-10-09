import React, { FC } from 'react';
import { Col, Row } from 'antd';
import parse from 'html-react-parser';

import nftImage from './assets/nft.png';

import s from './s.module.scss';

interface sectionProps {
  pictureLeft: boolean;
  heading: string;
  firstParagraphText: string;
  secondParagraphText: string;
}

const sectionComponent: FC<sectionProps> = props => {
  const pictureRight = props.pictureLeft ? false : true;

  const firstParagraph = parse(props.firstParagraphText);
  const secondParagraph = parse(props.secondParagraphText);
  return (
    <>
      <Row className={`${s.sectionContainer} ${pictureRight ? s.pictureRight : ''} `}>
        <Col sm={24} md={10} className={`${s.imageContainer} ${pictureRight ? s.imageContainerRight : ''}`}>
          <img src={nftImage} alt="nftImage"></img>
        </Col>
        <Col sm={24} md={14}>
          <div className={s.sectionTextContainer}>
            <p className="h2-bold">{props.heading}</p>
            <p className={`${s.firstParagraph} text`}>{firstParagraph}</p>
            <p className={`${s.lastParagraph} text`}>{secondParagraph}</p>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default sectionComponent;
