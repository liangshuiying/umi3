import { EnhanceTreeDataReturnType } from '@/utils/tree';
import { IConfig, OptionItemDTO } from './typing';
import CascaderContext from './cascader-context';
import React, { Component } from 'react';
import { RightOutlined, CheckOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';

interface IProps {
  enhanceTreeData: EnhanceTreeDataReturnType;
  config: IConfig;
  options: OptionItemDTO[];
}

type SelectedGroupItemType = OptionItemDTO | string;

interface IState {
  selectedGroup: SelectedGroupItemType[];
  tempSelectedGroup: OptionItemDTO[];
  oldSearchText: string;
}

class OptionPanel extends Component<IProps, IState> {
  state = {
    selectedGroup: [],
    tempSelectedGroup: [],
    oldSearchText: '',
  };

  panelItemWidth = 0;

  // 选择分组
  selectGroup = (value, level) => {
    let tempSelectedGroup: OptionItemDTO[] = [].concat(this.state.selectedGroup);

    tempSelectedGroup.splice(level);
    tempSelectedGroup[level] = value;

    this.setState({
      selectedGroup: tempSelectedGroup,
    });
  };

  changeScrollStyle = ({ style, ...props }) => {
    const thumbStyle = {
      width: '4px',
      backgroundColor: '#c6d0df',
      borderRadius: '2px',
    };
    return (
      <div
        style={{ ...style, ...thumbStyle }}
        {...props}
      />
    )
  }

  /**
   * 获取分组下拉列表（不包含最后一个列表）
   * @param options 分组列表
   * @param value 当前分组选中的值
   * @param key  key索引
   */
  renderGroupOptions = (options: OptionItemDTO[], value: SelectedGroupItemType, key: any) => {
    const { config } = this.props;

    return (
      <Scrollbars
        key={key}
        className="list_scrollbar"
        renderThumbVertical={this.changeScrollStyle}
        style={{ width: (1 / this.panelItemWidth) * 100 + '%', height: 230 }}
      >
        <div className="list" key={key}>
          <div
            className={classnames('option_item', { option_title: value === 'all' })}
            onClick={() => this.selectGroup('all', options[0].level)}
          >
            全部
            <RightOutlined className="icon_arrow_right" />
          </div>
          {options.map((item, index) => (
            <div
              key={index}
              className={classnames('option_item', { option_item_selected: value === item[config.key] })}
              onClick={() => this.selectGroup(item[config.key], item.level)}
            >
              {item[config.name]}
              <RightOutlined className="icon_arrow_right" />
            </div>
          ))}
        </div>
      </Scrollbars>
    );
  };

  // 选择的最后一列下拉列表的值
  selectValue = (selectedOption: OptionItemDTO, prevSelected, setSelected) => {
    const { config } = this.props;
    let index = prevSelected.findIndex(item => item[config.key] === selectedOption[config.key]);
    let selects: OptionItemDTO[] = [].concat(prevSelected);
    let { searchText } = this.context;
    const { oldSearchText } = this.state;

    if (index !== -1) {
      selects.splice(index, 1);
    } else {
      selects.push(selectedOption);
    }

    setSelected(selects);

    if (oldSearchText) return;
    this.setState({
      oldSearchText: searchText,
    });
  };

  // 获取最后一列下拉列表
  renderItemOptions = (options, selected, setSelected, key, searchText) => {
    const { config } = this.props;

    let filterlist = searchText ? options.filter(item => item.label.indexOf(searchText) !== -1) : options;
    return (
      <Scrollbars
        className="list_scrollbar"
        key={key}
        renderThumbVertical={this.changeScrollStyle}
        style={{ width: (1 / this.panelItemWidth) * 100 + '%', height: 230 }}
      >
        <div className="list">
          {filterlist.map((item, index) => (
            <div
              key={index}
              className={classnames('option_item', {
                option_item_selected: selected.find(element => element[config.key] === item[config.key]),
              })}
              onClick={() => this.selectValue(item, selected, setSelected)}
            >
              {item.label}
              {selected.find(element => element[config.key] === item[config.key]) ? (
                <CheckOutlined className="icon_selected" />
              ) : null}
            </div>
          ))}
          {filterlist.length === 0 && <span>暂无数据</span>}
        </div>
      </Scrollbars>
    );
  };

  /**
   * 获取分组下拉列表数据
   * @param options 分组列表
   * @param parentKey 父级key值
   * @param level 哪个层级
   * @returns 下拉列表源数据
   */
  getGroupOptionsData = (options, parentKey: any = '', level) => {
    let { selectedGroup } = this.state;
    // selectedGroup = tempSelectedGroup.length ? tempSelectedGroup : selectedGroup;
    const { converNodes, getChildrenByLevel, getOptionByLevel } = this.props.enhanceTreeData;
    if (parentKey === '') {
      return converNodes;
    }

    if (parentKey === 'all') {
      return getOptionByLevel(this.getGroupOptionsData(options, selectedGroup[level - 2], level - 1), level);
    }

    return getChildrenByLevel(parentKey);
  };

  /**
   * 选中的分组列表
   * @param selectedGroup
   * @param searchText
   * @param maxLevel
   */
  getSelectedGroup = (selectedGroup: SelectedGroupItemType[], searchText, maxLevel): SelectedGroupItemType[] => {
    let selected: SelectedGroupItemType[] = [];

    if (searchText) {
      for (let i = 0; i < maxLevel; i++) {
        selected.push('all');
      }
    } else {
      selected = selectedGroup;
    }

    return selected;
  };

  componentWillMount() {
    let selectedGroup: SelectedGroupItemType[] = [];
    const { selected } = this.context;
    if (selected.length) {
      for (let i = 0; i < this.props.enhanceTreeData.maxLevel; i++) {
        selectedGroup.push('all');
      }
    }

    this.setState({
      selectedGroup,
    });
  }

  render() {
    const { options } = this.props;
    let { selectedGroup, oldSearchText } = this.state;
    const { maxLevel, lastLevelValues } = this.props.enhanceTreeData;
    const { selected, setSelected, searchText } = this.context;
    let inputText = searchText || oldSearchText;

    let _selectedGroup: SelectedGroupItemType[] = this.getSelectedGroup(selectedGroup, inputText, maxLevel);
    this.panelItemWidth = _selectedGroup.length + 1;

    return (
      <div className="mlv_cascader_option_panel">
        {options.length === 0 && <p>无数据</p>}
        {options.length !== 0 && (
          <>
            {this.renderGroupOptions(this.getGroupOptionsData(options, '', null), _selectedGroup[0] || '', 0)}
            {_selectedGroup.map((item, index) =>
              _selectedGroup.length === maxLevel && index === maxLevel - 1
                ? this.renderItemOptions(
                  inputText ? lastLevelValues : this.getGroupOptionsData(options, _selectedGroup[index], index + 1),
                  selected,
                  setSelected,
                  index,
                  inputText,
                )
                : this.renderGroupOptions(
                  this.getGroupOptionsData(options, _selectedGroup[index], index + 1),
                  _selectedGroup[index + 1],
                  index,
                ),
            )}
          </>
        )}
      </div>
    );
  }
}
OptionPanel.contextType = CascaderContext;

export default OptionPanel;
