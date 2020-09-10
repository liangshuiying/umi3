import { EnhanceTreeData, OptionsType, EnhanceTreeDataReturnType } from '@/utils/tree';
import InputBox from './InputBox';
import OptionPanel from './OptionPanel';
import { Provider, ContextModelType } from './cascader-context';
import { IConfig, OptionItemDTO, SelectedDTO, OptionValue } from './typing';
import { findDOMNode } from 'react-dom';
import React, { Component } from 'react';
import './index.less';

interface IProps {
  options?: OptionItemDTO[];
  config?: IConfig | { key: string; name: string };
  defaultSelected?: OptionValue[];
  onChange(SelectedDTO): any;
}

interface IState extends ContextModelType {}

export default class MultiValuedCascader extends Component<IProps, IState> {
  wrapperDom: any = null;
  options = {};
  enhanceTreeData = {};
  config = this.props.config || { key: 'value', name: 'label' };

  // 删除选中的选项
  removeItem = value => {
    this.setState({
      selected: this.state.selected.filter((item: OptionItemDTO) => {
        return item.value !== value;
      }),
    });
  };

  // 输入框获取焦点或者失去焦点
  changeInputFocused = isSearchInputFocus => {
    this.setState({
      inputFocused: isSearchInputFocus,
    });
  };

  // 设置选择值
  setSelected = selectedValues => {
    this.setState({
      selected: selectedValues,
      searchText: '',
    });
  };

  // 清空搜索输入
  setSearchText = text => {
    this.setState({ searchText: text });
  };

  state = {
    selected: [],
    inputFocused: false,
    removeItem: this.removeItem,
    changeInputFocused: this.changeInputFocused,
    setSelected: this.setSelected,
    searchText: '',
    setSearchText: this.setSearchText,
  };

  componentDidUpdate(prevProps, prevState) {
    const { onChange } = this.props;

    if (prevState.selected.sort().toString() !== this.state.selected.sort().toString()) {
      let result = this.state.selected.map(item => ({ label: item.label, value: item.value }));
      onChange(result);
    }
  }

  componentWillMount() {
    const { defaultSelected = [], options = [] } = this.props;
    const config = this.config;

    this.enhanceTreeData = EnhanceTreeData(options, config as OptionsType);
    const { lastLevelValues } = this.enhanceTreeData as EnhanceTreeDataReturnType;
    this.options = options;

    this.setState({
      selected: defaultSelected.map(key => lastLevelValues.find(item => item[config.key] === key)) as any[],
    });
  }

  componentWillReceiveProps(nextProps) {
    const { options = [], defaultSelected = [] } = nextProps;
    if (options !== this.props.options) {
      const config = this.config;

      this.enhanceTreeData = EnhanceTreeData(options, config as OptionsType);
      const { lastLevelValues } = this.enhanceTreeData as EnhanceTreeDataReturnType;
      this.options = options;

      this.setState({
        selected: defaultSelected.map(key => lastLevelValues.find(item => item[config.key] === key)) as any[],
      });
    }
    return false;
  }

  // 点击组件容器
  clickWrapper = e => {
    if (e.target.matches('svg') || e.target.matches('path')) return;
    this.changeInputFocused(true);
  };

  clickBody = e => {
    if (this.wrapperDom && findDOMNode(this.wrapperDom) && findDOMNode(this.wrapperDom)!.contains(e.target)) return;
    this.changeInputFocused(false);
    this.setSearchText('');
  };

  componentDidMount() {
    this.wrapperDom.addEventListener('click', this.clickWrapper, false);
    document.body.addEventListener('click', this.clickBody, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.clickBody, false);
    this.wrapperDom.removeEventListener('click', this.clickWrapper, false);
  }

  render() {
    const { inputFocused } = this.state;
    return (
      <div ref={dom => (this.wrapperDom = dom)} style={{ position: 'relative' }}>
        <Provider value={this.state}>
          <InputBox config={this.config} />
          {inputFocused && (
            <OptionPanel
              enhanceTreeData={this.enhanceTreeData as EnhanceTreeDataReturnType}
              config={this.config}
              options={this.props.options || []}
            />
          )}
        </Provider>
      </div>
    );
  }
}
