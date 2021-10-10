import React from 'react';

import JumbotronComponent from '../../components/jumbotron';
import MintComponent from '../../components/mint-component';
import MissionCountComponent from '../../components/mission-count';
import SectionComponent from '../../components/section';

const MintView: React.FC = () => {
  return (
    <>
      <JumbotronComponent />
      <div className="content-container-fix content-container">
        <SectionComponent
          pictureLeft={true}
          heading="SECOND HEADLINE"
          firstParagraphText="Through a lineup of core products EnterDAO aims to
              <b> empower users, metaverse land owners, investors, brands and degens of all kinds</b> by tackling pain
              points like access to metaverse land, its capital efficiency, as well as UX and onboarding of metaverse
              games."
          secondParagraphText="EnterDAO is set to build 2 core products — <b>LandWorks</b> and <b>MetaPortal</b>, as well as an NFT drop called
            <b>MetaPass</b>."
        />
        <SectionComponent
          pictureLeft={false}
          heading="THIRD HEADLINE"
          firstParagraphText="LandWorks is a <b>metaverse land renting marketplace based on Ethereum</b>. The protocol enables period-based renting of land in Web3 metaverse games."
          secondParagraphText="LandWorks will start off with Decentraland as a primer and then <br> gradually expand to support other prominent games. It will enable landowners to <b>earn passive income on their assets</b>, while renters looking to leverage metaverse games will be able to easily rent instead of buying virtual land properties."
        />
        <MissionCountComponent totalNFTs={10} totalAttributes={133} mission={1} />
        <MintComponent></MintComponent>
      </div>
    </>
  );
};

export default MintView;
