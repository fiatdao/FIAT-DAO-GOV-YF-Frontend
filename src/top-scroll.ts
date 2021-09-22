import React from "react";
import { withRouter } from "react-router-dom";

class ScrollToTop extends React.Component<any, any> {
  componentDidUpdate(prevProps: any) {
    // @ts-ignore
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }
}

export default withRouter(ScrollToTop);
