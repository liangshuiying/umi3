import StepOne from './StepOne';
import { Modal, message } from 'antd';
import React from 'react';

export interface SearchModalProps {
  visible: boolean;
  type: string;
  handleSubmit: Function;
  onCancel: () => void;
  handleSearch: Function;
  total: number;
}

export interface SearchModalStates {
  selectedList: SelectedLists | any[];
  interFaceRes: any;
}

export interface SelectedLists {
  id: string | number;
}

export default class SearchModal extends React.Component<SearchModalProps, SearchModalStates> {

  state = {
    selectedList: [],
    interFaceRes: null
  };

  close = () => {
    this.props.onCancel();
  };

  // 获取选中的素材列表
  getSelectedList = (list) => {
    this.setState({
      selectedList: list
    });
  };

  handleOk = async () => {
    let { selectedList } = this.state;
    if (selectedList.length < 1) {
      message.warning('请选择至少1条数据');
      return;
    }
    if (selectedList.length > 3) {
      message.warning('请选择最多3条数据');
      return;
    }
    console.log('interFaceRes=========', this.state.interFaceRes);
  };

  render() {
    const { type, visible } = this.props;

    const types = {
      pic: '选择图片',
      video: '选择视频',
      arc: '选择图文',
    };

    return (
      <Modal
        destroyOnClose={true}
        width={'756px'}
        style={{ height: '568px', top: '50%', marginTop: '-284px', left: '50%', marginLeft: '-376px' }}
        visible={visible}
        maskClosable={false}
        title={types[type]}
        className={'SelectModal'}
        onCancel={this.close}
        onOk={this.handleOk}
      >
        <StepOne getSelectedList={this.getSelectedList} {...this.props} />
      </Modal>
    );
  }
}