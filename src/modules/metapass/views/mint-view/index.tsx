import React from 'react';

import JumbotronComponent from '../../components/jumbotron';
import MintComponent from '../../components/mint-component';

const MintView: React.FC = () => {
  return (
    <>
      <JumbotronComponent />
      <div className="content-container-fix content-container">
        <MintComponent></MintComponent>
      </div>
    </>
  );
};

export default MintView;
