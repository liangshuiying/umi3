import React from 'react';
import { connect } from 'dva';

interface IProps {
  children: any;
  path: string;
  code: string;
  authBtns?: any;
}

const Permission: React.FC<IProps> = ({ authBtns, children, code, path }) => {
  const currentAuthBtns = authBtns.length ? authBtns.find(item => item.path === path).btnsList : [];
  const hasAuth = currentAuthBtns && currentAuthBtns.length && currentAuthBtns.some(item => item.code === code);

  return <>{!!hasAuth && children}</>;
};

const mapStateToProps = state => {
  return {
    authBtns: state.global.btnsList,
  };
};

export default connect(mapStateToProps)(Permission);
