import React, { Component } from 'react';
import { Tree } from 'antd';

import './index.less';

interface IProps {
  treeData: any;
  onSelect: any;
}

class SceneLevelTree extends Component<IProps> {
  render() {
    const { treeData, onSelect } = this.props;
    return (
      <div className="scenelevel_tree">
        <Tree treeData={treeData} defaultExpandAll={true} onSelect={onSelect} />
      </div>
    );
  }
}

export default SceneLevelTree;
