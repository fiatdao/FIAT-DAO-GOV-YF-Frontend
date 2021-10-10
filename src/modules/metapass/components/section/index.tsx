import React, { FC } from 'react';
import { Col, Row } from 'antd';
import parse from 'html-react-parser';

import nftImage from './assets/nft.png';

import './index.scss';

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
      <Row
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        className={`section-container ${pictureRight ? 'picture-right' : ''} `}>
        <Col sm={24} md={10} className={`image-container ${pictureRight ? 'image-container-right' : ''}`}>
          <img src={nftImage} alt="nftImage"></img>
        </Col>
        <Col sm={24} md={14}>
          <div className="section-text-container">
            <p className="h2-bold">{props.heading}</p>
            <p className="first-paragraph text">{firstParagraph}</p>
            <p className="last-paragraph text">{secondParagraph}</p>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default sectionComponent;
