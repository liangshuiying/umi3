import { Dropdown } from 'antd';
import React from 'react';
import classNames from 'classnames';
import { DropDownProps } from 'antd/es/dropdown/dropdown';
import styles from './index.less';

export interface HeaderDropdownProps extends DropDownProps {
  overlayClassName?: string;
}

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ overlayClassName: cls, ...restProps }) => (
  <Dropdown overlayClassName={classNames(styles.container, cls)} {...restProps} />
);

export default HeaderDropdown;
