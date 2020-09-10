/* eslint-disable @typescript-eslint/unbound-method */
import React, { useState, useEffect } from 'react';
import { isNaN as _isNaN } from 'lodash';

// const selector = document.querySelector;

type withAutoHeightType = (arg0: any, arg1?: any) => any;

const withAutoHeight: withAutoHeightType = (WrapperComponent, config = { type: 1, minisHeight: 0 }) => {
  return props => {
    const [contentHeight, setContentHeight] = useState(0);
    const { type = 1, minisHeight = 0 } = config;

    const calculatHeight = () => {
      const titleAreaDom =
        type === 2
          ? document.querySelector('.ant-pro-page-header-wrap-page-header-warp')
          : document.querySelector('.ant-page-header-ghost');
      const visibleHeight = document.documentElement.clientHeight;
      const headerBarHeight = document.querySelector('.ant-pro-top-menu').offsetHeight;
      const titleHeight = titleAreaDom.offsetHeight + 24;
      const newHeight = visibleHeight - headerBarHeight - titleHeight - minisHeight;
      if (newHeight > 100 && !_isNaN(newHeight)) {
        setContentHeight(newHeight);
        console.log(newHeight);
      }
    };

    useEffect(() => {
      calculatHeight();
      window.addEventListener('resize', calculatHeight, false);

      return () => {
        window.removeEventListener('resize', calculatHeight, false);
      };
    }, []);

    return <WrapperComponent {...props} contentHeight={contentHeight} />;
  };
};

export default withAutoHeight;
