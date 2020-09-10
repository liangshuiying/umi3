import React from 'react';
import AvatarDropdown from './AvatarDropdown';
import styles from './index.module.less';

const RightContent = () => {
  return (
    <div className={styles.right}>
      <AvatarDropdown />
    </div>
  );
};

export default RightContent;
