import styles from './index.module.less';
import React from 'react';
import { Drawer, Button } from 'antd';
import { DrawerProps } from 'antd/lib/drawer/index';

interface IProps extends DrawerProps {
  onCancel: () => void;
  onRequire: () => void;
}

const ScrmDrawer: React.FC<IProps> = ({ children, onCancel, onRequire, ...props }) => {
  const FooterNode = (
    <div className={styles.footer}>
      <Button onClick={onCancel}>取消</Button>
      <Button type="primary" style={{ marginLeft: 8 }} onClick={onRequire}>
        提交
      </Button>
    </div>
  );

  return (
    <Drawer width={600} footer={FooterNode} closable={false} destroyOnClose={true} {...props}>
      {children}
    </Drawer>
  );
};

export default ScrmDrawer;
