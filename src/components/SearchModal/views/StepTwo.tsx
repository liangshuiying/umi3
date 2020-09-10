import styles from '../SearchModal.less';
import React from 'react';
import { Spin } from 'antd';


export default class StepTwo extends React.Component {
  render() {
    return (
      <div className={styles.loadingContent}>
        <Spin size="large" />
        <p>转换中</p>
      </div>
    );
  }
}