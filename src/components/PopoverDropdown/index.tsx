import IconFont from '@/components/IconFont';
import * as styles from './index.module.less';
import React, { useState } from 'react';
import { Popover, Button } from 'antd';
import cls from 'classnames';

interface PopoverDropdownProps {
  onEdit: () => void;
  onDelete: () => void;
}

const PopoverDropdown: React.FC<PopoverDropdownProps> = ({ onDelete, onEdit }) => {
  const [isActive, changeActive] = useState(false);
  return (
    <Popover
      overlayClassName={styles.popDropDown}
      trigger="click"
      placement="bottomRight"
      onVisibleChange={visiable => {
        changeActive(visiable);
      }}
      visible={isActive}
      content={
        <>
          <Button
            type="link"
            className={cls(styles.editBtn, styles.btn)}
            onClick={() => {
              changeActive(false);
              onEdit();
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            className={styles.btn}
            onClick={() => {
              changeActive(false);
              onDelete();
            }}
          >
            删除
          </Button>
        </>
      }
    >
      <IconFont type="iconoperating_1" style={{ fontSize: 22, fontWeight: 'bold', position: 'relative', top: 2 }} />
    </Popover>
  );
};

/* <IconFont type={isActive ? 'icon-operating_2' : 'icon-operating_1'} className={styles.menuIcon} /> */

export default PopoverDropdown;
