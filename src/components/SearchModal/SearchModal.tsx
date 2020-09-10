import StepOne from './views/StepOne';
import StepTwo from './views/StepTwo';
import { Modal, Steps, Button, message } from 'antd';
import React from 'react';
const { Step } = Steps;

export interface SearchModalProps {
  visible: boolean;
  type: string;
  handleSubmit: Function;
  onCancel: () => void;
  handleSearch: Function;
  total: number;
  selectOps: any;
}

export interface SearchModalStates {
  current: number;
  selectedList: SelectedLists | any[];
  interFaceRes: any;
}

export interface SelectedLists {
  id: string | number;
}

export default class SearchModal extends React.Component<SearchModalProps, SearchModalStates> {

  state = {
    current: 0,
    selectedList: [],
    interFaceRes: null
  };

  close = () => {
    this.setState({
      current: 0
    });
    this.props.onCancel();
  };
  // 获取step1中选择的素材列表
  getSelectedList = (list) => {
    this.setState({
      selectedList: list
    });
  };

  handleOk = async () => {
    let { current, selectedList } = this.state;
    // 选择完素材，点下一步，跳转到step2,等待接口返回，接口返回后跳转到step3
    if (selectedList.length < 1) {
      message.warning('请选择至少1条数据');
      return;
    }
    if (selectedList.length > 3) {
      message.warning('请选择最多3条数据');
      return;
    }
    if (current === 0) {
      this.setState({
        current: 1
      });

      // let res = await this.props.handleSubmit(selectedList);
      // if (res && res.status) {
      //   this.setState({
      //     current: 2,
      //     interFaceRes: res
      //   });
      // }

      setTimeout(() => {
        this.setState({
          current: 2
        });
      }, 2000);
    }

    // step3中确定事件逻辑
    if (current === 2) {
      console.log('interFaceRes=========', this.state.interFaceRes);
    }
  };

  render() {
    const { current } = this.state;
    const { type, visible } = this.props;
    const btnList = {
      0: [
        <Button key="back" onClick={this.close}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={this.handleOk}>
          下一步
        </Button>,
      ],
      1: [
        <Button key="back" onClick={this.close}>
          取消
        </Button>
      ],
      2: [
        <Button key="back" onClick={this.close}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={this.handleOk}>
          确定
        </Button>,
      ],
    };

    const types = {
      pic: '选择图片',
      video: '选择视频',
      arc: '选择文章',
      text: '选择文本',
    };

    const steps = [
      {
        title: '选择素材',
        content: 'first',
      },
      {
        title: '转换并上传',
        content: 'second',
      },
      {
        title: '完成',
        content: 'last',
      },
    ];

    return (
      <Modal
        destroyOnClose={true}
        width={'650px'}
        style={{ height: '488px', top: '50%', marginTop: '-248px', left: '50%', marginLeft: '-260px' }}
        visible={visible}
        maskClosable={false}
        title={types[type]}
        className={'SearchModal'}
        footer={btnList[current]}
      >
        <Steps current={current} size="small" style={{ width: '60%', marginLeft: '20%' }}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        {
          current === 0 ? <StepOne currentStep={current} getSelectedList={this.getSelectedList} {...this.props} /> : ''
        }
        {
          current === 1 ? <StepTwo /> : ''
        }
        {
          current === 2 ? <StepOne currentStep={current} getSelectedList={this.getSelectedList} {...this.props} /> : ''
        }
      </Modal>
    );
  }
}