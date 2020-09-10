import React from 'react';
import { Menu, Avatar, Dropdown } from 'antd';
import { LogoutOutlined, CaretDownOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { startsWith as _startsWith } from 'lodash';
import defaultLogo from '@/assets/header_defaultava.svg';
import styles from './index.module.less';
import { useRightContentActions } from './action';

const AvatarDropdown = () => {
  const { logout } = useRightContentActions();
  const onMenuClick = (event: any) => {
    const { key } = event;

    if (_startsWith(key, 'name')) {
      return;
    }

    if (key === 'logout') {
      // 退出
      logout();
      return;
    }

    // 其他路由跳转
    // history.push(`/account/${key}`);
  };
  let currentAuthority = JSON.parse(Cookies.get('currentAuthority') || '{}');
  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="name" style={{ cursor: 'default', background: 'transparent' }}>
        {currentAuthority.domain_name}
      </Menu.Item>
      {/* <Menu.Item key="name1" style={{ cursor: 'default', background: 'transparent' }}>
        操作员：{currentAuthority.account_name}
      </Menu.Item> */}
      <Menu.Divider style={{ margin: 0 }} key="divider" />
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <span>{currentAuthority.account_name}</span>
      <Dropdown overlayClassName={styles.container} overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="small"
            className={styles.avatar}
            src={currentAuthority.portrait_url ? currentAuthority.portrait_url : defaultLogo}
            alt="avatar"
          />
          <CaretDownOutlined />
        </span>
      </Dropdown>
    </>
  );
};

export default AvatarDropdown;
