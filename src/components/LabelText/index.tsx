import React from 'react';

import styles from './index.module.less';

export interface LabelTextProps {
  style?: React.CSSProperties;
}
const LabelText: React.FC<LabelTextProps> = ({ style = {}, children }) => {
  return (
    <span className={styles.text} style={style}>
      {children}
    </span>
  );
};

export default LabelText;
