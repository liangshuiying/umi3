import * as React from 'react';
import classNames from 'classnames';
import { isEqual, omit, reduce } from 'lodash';
import CloseCircleFilled from '@ant-design/icons/CloseCircleFilled';
import DownOutlined from '@ant-design/icons/DownOutlined';
import RightOutlined from '@ant-design/icons/RightOutlined';
import RedoOutlined from '@ant-design/icons/RedoOutlined';
import { Input, Empty } from 'antd';
import { RenderEmptyHandler } from 'antd/es/config-provider';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import RcCascader from './Cascader';
import KeyCode from './KeyCode';
import { arrayTreeFilter } from './util';

export interface CascaderOptionType {
  value?: string;
  label?: React.ReactNode;
  disabled?: boolean;
  isLeaf?: boolean;
  loading?: boolean;
  children?: CascaderOptionType[];
  [key: string]: any;
}

export interface FieldNamesType {
  value?: string;
  label?: string;
  children?: string;
}

export interface FilledFieldNamesType {
  value: string;
  label: string;
  children: string;
}

export type CascaderExpandTrigger = 'click' | 'hover';

export interface ShowSearchType {
  filter?: (inputValue: string, path: CascaderOptionType[], names: FilledFieldNamesType) => boolean;
  render?: (
    inputValue: string,
    path: CascaderOptionType[],
    prefixCls: string | undefined,
    names: FilledFieldNamesType,
  ) => React.ReactNode;
  sort?: (a: CascaderOptionType[], b: CascaderOptionType[], inputValue: string, names: FilledFieldNamesType) => number;
  matchInputWidth?: boolean;
  limit?: number | false;
}

export interface CascaderProps {
  /** 可选项数据源 */
  options: CascaderOptionType[];
  /** 默认的选中项 */
  defaultValue?: string[];
  /** 指定选中项 */
  value?: string[];
  /** 选择完成后的回调 */
  onChange?: (value: string[], selectedOptions?: CascaderOptionType[]) => void;
  /** 选择后展示的渲染函数 */
  displayRender?: (label: string[], selectedOptions?: CascaderOptionType[]) => React.ReactNode;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
  /** 自定义浮层类名 */
  popupClassName?: string;
  /** 浮层预设位置：`bottomLeft` `bottomRight` `topLeft` `topRight` */
  popupPlacement?: string;
  /** 输入框占位文本 */
  placeholder?: string;
  /** 输入框大小，可选 `large` `default` `small` */
  size?: SizeType;
  /** whether has border style */
  bordered?: boolean;
  /** 禁用 */
  disabled?: boolean;
  /** 是否支持清除 */
  allowClear?: boolean;
  showSearch?: boolean | ShowSearchType;
  notFoundContent?: React.ReactNode;
  loadData?: (selectedOptions?: CascaderOptionType[]) => void;
  /** 次级菜单的展开方式，可选 'click' 和 'hover' */
  expandTrigger?: CascaderExpandTrigger;
  /** 当此项为 true 时，点选每级菜单选项值都会发生变化 */
  changeOnSelect?: boolean;
  /** 浮层可见变化时回调 */
  onPopupVisibleChange?: (popupVisible: boolean) => void;
  prefixCls?: string;
  inputPrefixCls?: string;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  popupVisible?: boolean;
  /** use this after antd@3.7.0 */
  fieldNames?: FieldNamesType;
  suffixIcon?: React.ReactNode;
  autoComplete?: string;
  containAll?: boolean;
}

export interface CascaderState {
  inputFocused: boolean;
  inputValue: string;
  value: string[];
  popupVisible: boolean | undefined;
  flattenOptions: CascaderOptionType[][] | undefined;
  prevProps: CascaderProps;
}

// We limit the filtered item count by default
const defaultLimit = 50;

function highlightKeyword(str: string, keyword: string, prefixCls: string | undefined) {
  return str.split(keyword).map((node: string, index: number) =>
    index === 0
      ? node
      : [
          <span className={`${prefixCls}-menu-item-keyword`} key="seperator">
            {keyword}
          </span>,
          node,
        ],
  );
}

function defaultFilterOption(inputValue: string, path: CascaderOptionType[], names: FilledFieldNamesType) {
  return path.some(option => (option[names.label] as string).includes(inputValue));
}

function defaultRenderFilteredOption(
  inputValue: string,
  path: CascaderOptionType[],
  prefixCls: string | undefined,
  names: FilledFieldNamesType,
) {
  return (
    <span>
      {path.map((option, index) => {
        const label = option[names.label];
        const node = (label as string).includes(inputValue)
          ? highlightKeyword(label as string, inputValue, prefixCls)
          : label;
        return index === 0 ? node : [' / ', node];
      })}
    </span>
  );
}

function defaultSortFilteredOption(
  a: CascaderOptionType[],
  b: CascaderOptionType[],
  inputValue: string,
  names: FilledFieldNamesType,
) {
  function callback(elem: CascaderOptionType) {
    return (elem[names.label] as string).includes(inputValue);
  }

  return a.findIndex(callback) - b.findIndex(callback);
}

function getFieldNames({ fieldNames }: CascaderProps) {
  return fieldNames;
}

function getFilledFieldNames(props: CascaderProps) {
  const fieldNames = getFieldNames(props) || {};
  const names: FilledFieldNamesType = {
    children: fieldNames.children || 'children',
    label: fieldNames.label || 'label',
    value: fieldNames.value || 'value',
  };
  return names;
}

function flattenTree(options: CascaderOptionType[], props: CascaderProps, ancestor: CascaderOptionType[] = []) {
  const names: FilledFieldNamesType = getFilledFieldNames(props);
  let flattenOptions: CascaderOptionType[][] = [];
  const childrenName = names.children;
  options.forEach(option => {
    const path = ancestor.concat(option);
    if (props.changeOnSelect || !option[childrenName] || !option[childrenName].length) {
      flattenOptions.push(path);
    }
    if (option[childrenName]) {
      flattenOptions = flattenOptions.concat(flattenTree(option[childrenName], props, path));
    }
  });
  return flattenOptions;
}

const defaultDisplayRender = (label: string[]) => label.join(' / ');

function warningValueNotExist(list: CascaderOptionType[], fieldNames: FieldNamesType = {}) {
  (list || []).forEach(item => {
    warningValueNotExist(item[fieldNames.children || 'children'], fieldNames);
  });
}

class EventCascader extends React.Component<CascaderProps, CascaderState> {
  static defaultProps = {
    transitionName: 'slide-up',
    options: [],
    disabled: false,
    allowClear: true,
    bordered: true,
  };

  static getDerivedStateFromProps(nextProps: CascaderProps, { prevProps }: CascaderState) {
    const newState: Partial<CascaderState> = {
      prevProps: nextProps,
    };

    if ('value' in nextProps) {
      newState.value = nextProps.value || [];
    }
    if ('popupVisible' in nextProps) {
      newState.popupVisible = nextProps.popupVisible;
    }
    if (nextProps.showSearch && prevProps.options !== nextProps.options) {
      newState.flattenOptions = flattenTree(nextProps.options, nextProps);
    }

    if (process.env.NODE_ENV !== 'production' && nextProps.options) {
      warningValueNotExist(nextProps.options, getFieldNames(nextProps));
    }

    return newState;
  }

  cachedOptions: CascaderOptionType[] = [];

  private input: Input | null = null;

  constructor(props: CascaderProps) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue || [],
      inputValue: '',
      inputFocused: false,
      popupVisible: props.popupVisible,
      flattenOptions: props.showSearch ? flattenTree(props.options, props) : undefined,
      prevProps: props,
    };
  }

  setValue = (value: string[], selectedOptions: CascaderOptionType[] = []) => {
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    const { onChange } = this.props;
    if (onChange) {
      onChange(value, selectedOptions);
    }
  };

  getLabel() {
    const { displayRender = defaultDisplayRender as Function } = this.props;
    const options = this.computedOptions();
    const names = getFilledFieldNames(this.props);
    const { value } = this.state;
    const unwrappedValue = Array.isArray(value[0]) ? value[0] : value;
    const selectedOptions: CascaderOptionType[] = arrayTreeFilter(
      options,
      (o: CascaderOptionType, level: number) => o[names.value] === unwrappedValue[level],
      { childrenKeyName: names.children },
    );
    const label = selectedOptions.map(o => o[names.label]);
    return displayRender(label, selectedOptions);
  }

  saveInput = (node: Input) => {
    this.input = node;
  };

  handleChange = (value: any, selectedOptions: CascaderOptionType[]) => {
    this.setState({ inputValue: '' });
    if (selectedOptions[0].__IS_FILTERED_OPTION) {
      const unwrappedValue = value[0];
      const unwrappedSelectedOptions = selectedOptions[0].path;
      console.log(selectedOptions);
      this.setValue(unwrappedValue, unwrappedSelectedOptions);
      return;
    }
    this.setValue(value, selectedOptions);
  };

  handlePopupVisibleChange = (popupVisible: boolean) => {
    if (!('popupVisible' in this.props)) {
      this.setState(state => ({
        popupVisible,
        inputFocused: popupVisible,
        inputValue: popupVisible ? state.inputValue : '',
      }));
    }

    const { onPopupVisibleChange } = this.props;
    if (onPopupVisibleChange) {
      onPopupVisibleChange(popupVisible);
    }
  };

  handleInputBlur = () => {
    this.setState({
      inputFocused: false,
    });
  };

  handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const { inputFocused, popupVisible } = this.state;
    // Prevent `Trigger` behaviour.
    if (inputFocused || popupVisible) {
      e.stopPropagation();
      if (e.nativeEvent.stopImmediatePropagation) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // SPACE => https://github.com/ant-design/ant-design/issues/16871
    if (e.keyCode === KeyCode.BACKSPACE || e.keyCode === KeyCode.SPACE) {
      e.stopPropagation();
    }
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    this.setState({ inputValue });
  };

  clearSelection = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!this.state.inputValue) {
      this.setValue([]);
      this.handlePopupVisibleChange(false);
    } else {
      this.setState({ inputValue: '' });
    }
  };

  generateFilteredOptions(prefixCls: string | undefined, renderEmpty: RenderEmptyHandler) {
    const { showSearch, notFoundContent } = this.props;
    const names: FilledFieldNamesType = getFilledFieldNames(this.props);
    const {
      filter = defaultFilterOption,
      render = defaultRenderFilteredOption,
      sort = defaultSortFilteredOption,
      limit = defaultLimit,
    } = showSearch as ShowSearchType;
    const { flattenOptions = [], inputValue } = this.state;

    // Limit the filter if needed
    let filtered: CascaderOptionType[][];
    if (limit > 0) {
      filtered = [];
      let matchCount = 0;

      // Perf optimization to filter items only below the limit
      flattenOptions.some(path => {
        const match = filter(this.state.inputValue, path, names);
        if (match) {
          filtered.push(path);
          matchCount += 1;
        }
        return matchCount >= limit;
      });
    } else {
      console.error(typeof limit !== 'number', 'Cascader', "'limit' of showSearch should be positive number or false.");
      filtered = flattenOptions.filter(path => filter(this.state.inputValue, path, names));
    }

    filtered.sort((a, b) => sort(a, b, inputValue, names));

    if (filtered.length > 0) {
      return filtered.map((path: CascaderOptionType[]) => {
        return {
          __IS_FILTERED_OPTION: true,
          path,
          [names.value]: path.map((o: CascaderOptionType) => o[names.value]),
          [names.label]: render(inputValue, path, prefixCls, names),
          disabled: path.some((o: CascaderOptionType) => !!o.disabled),
          isEmptyNode: true,
        } as CascaderOptionType;
      });
    }
    return [
      {
        [names.value]: 'ANT_CASCADER_NOT_FOUND',
        [names.label]: notFoundContent || renderEmpty('Cascader'),
        disabled: true,
        isEmptyNode: true,
      },
    ];
  }

  focus() {
    console.log(this.input);
    if (this.input) {
      this.input.focus();
    }
  }

  blur() {
    if (this.input) {
      this.input.blur();
    }
  }

  getPopupPlacement(direction = 'ltr') {
    const { popupPlacement } = this.props;
    if (popupPlacement !== undefined) {
      return popupPlacement;
    }
    return direction === 'rtl' ? 'bottomRight' : 'bottomLeft';
  }

  getPrefixCls = (suffixCls: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;

    return `ant-${suffixCls}`;
  };

  getFieldName(name: string): string {
    const names = getFilledFieldNames(this.props);
    return names[name];
  }

  computedOptions = () => {
    const { options = [], containAll = true } = this.props;
    if (!containAll) {
      return options;
    }
    const results = [...options];

    const opts = reduce<CascaderOptionType, CascaderOptionType[]>(
      options,
      (tmp, opt) => {
        if (opt.children) {
          return tmp.concat(...opt.children);
        }
        return tmp;
      },
      [],
    );
    const allOption: CascaderOptionType = {
      [this.getFieldName('value')]: '__all__',
      [this.getFieldName('label')]: '全部',
      [this.getFieldName('children')]: opts,
    };
    results.unshift(allOption);
    return results;
  };

  renderEmpty = (componentName?: string) => {
    const prefix = this.getPrefixCls('empty');

    switch (componentName) {
      case 'Table':
      case 'List':
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

      case 'Select':
      case 'TreeSelect':
      case 'Cascader':
      case 'Transfer':
      case 'Mentions':
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className={`${prefix}-small`} />;
      default:
        return <Empty />;
    }
  };

  getContextPopupContainer = () => document.body;

  render() {
    const { props, state } = this;
    const {
      prefixCls: customizePrefixCls,
      inputPrefixCls: customizeInputPrefixCls,
      children,
      placeholder = '请选择',
      size: customizeSize,
      disabled,
      className,
      style,
      allowClear,
      showSearch = false,
      suffixIcon,
      notFoundContent,
      popupClassName,
      bordered,
      ...otherProps
    } = props;
    const mergedSize = customizeSize;

    const { value, inputFocused } = state;

    const prefixCls = this.getPrefixCls('cascader', customizePrefixCls);
    const inputPrefixCls = this.getPrefixCls('input', customizeInputPrefixCls);

    const sizeCls = classNames({
      [`${inputPrefixCls}-lg`]: mergedSize === 'large',
      [`${inputPrefixCls}-sm`]: mergedSize === 'small',
    });
    const clearIcon =
      (allowClear && !disabled && value.length > 0) || state.inputValue ? (
        <CloseCircleFilled className={`${prefixCls}-picker-clear`} onClick={this.clearSelection} />
      ) : null;
    const arrowCls = classNames({
      [`${prefixCls}-picker-arrow`]: true,
      [`${prefixCls}-picker-arrow-expand`]: state.popupVisible,
    });
    const pickerCls = classNames(className, `${prefixCls}-picker`, {
      [`${prefixCls}-picker-with-value`]: state.inputValue,
      [`${prefixCls}-picker-disabled`]: disabled,
      [`${prefixCls}-picker-${mergedSize}`]: !!mergedSize,
      [`${prefixCls}-picker-show-search`]: !!showSearch,
      [`${prefixCls}-picker-focused`]: inputFocused,
      [`${prefixCls}-picker-borderless`]: !bordered,
    });

    // Fix bug of https://github.com/facebook/react/pull/5004
    // and https://fb.me/react-unknown-prop
    const inputProps = omit(otherProps, [
      'onChange',
      'options',
      'popupPlacement',
      'transitionName',
      'displayRender',
      'onPopupVisibleChange',
      'changeOnSelect',
      'expandTrigger',
      'popupVisible',
      'getPopupContainer',
      'loadData',
      'popupClassName',
      'filterOption',
      'renderFilteredOption',
      'sortFilteredOption',
      'notFoundContent',
      'fieldNames',
      'bordered',
    ]);

    let options = this.computedOptions();
    const names: FilledFieldNamesType = getFilledFieldNames(this.props);
    if (options && options.length > 0) {
      if (state.inputValue) {
        const filteredOptions = this.generateFilteredOptions(prefixCls, this.renderEmpty);
        options = isEqual(filteredOptions, this.cachedOptions) ? this.cachedOptions : filteredOptions;
      }
    } else {
      options = [
        {
          [names.label]: notFoundContent,
          [names.value]: 'ANT_CASCADER_NOT_FOUND',
          disabled: true,
        },
      ];
    }
    // Dropdown menu should keep previous status until it is fully closed.
    if (!state.popupVisible) {
      options = this.cachedOptions;
    } else {
      this.cachedOptions = options;
    }

    const dropdownMenuColumnStyle: { width?: number; height?: string } = {};
    const isNotFound = (options || []).length === 1 && options[0].isEmptyNode;
    if (isNotFound) {
      dropdownMenuColumnStyle.height = 'auto'; // Height of one row.
    }
    // The default value of `matchInputWidth` is `true`
    const resultListMatchInputWidth = (showSearch as ShowSearchType).matchInputWidth !== false;
    if (resultListMatchInputWidth && (state.inputValue || isNotFound) && this.input) {
      dropdownMenuColumnStyle.width = this.input.input.offsetWidth;
    }

    const inputIcon = (suffixIcon &&
      (React.isValidElement<{ className?: string }>(suffixIcon) ? (
        React.cloneElement(suffixIcon, {
          className: classNames({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            [suffixIcon.props.className!]: suffixIcon.props.className,
            [`${prefixCls}-picker-arrow`]: true,
          }),
        })
      ) : (
        <span className={`${prefixCls}-picker-arrow`}>{suffixIcon}</span>
      ))) || <DownOutlined className={arrowCls} />;

    const input = children || (
      <span style={style} className={pickerCls}>
        <span className={`${prefixCls}-picker-label`}>{this.getLabel()}</span>
        <Input
          {...inputProps}
          tabIndex={-1}
          ref={this.saveInput}
          prefixCls={inputPrefixCls}
          placeholder={value && value.length > 0 ? undefined : placeholder}
          className={`${prefixCls}-input ${sizeCls}`}
          value={state.inputValue}
          disabled={disabled}
          readOnly={!showSearch}
          autoComplete={inputProps.autoComplete || 'off'}
          onClick={showSearch ? this.handleInputClick : undefined}
          onBlur={showSearch ? this.handleInputBlur : undefined}
          onKeyDown={this.handleKeyDown}
          onChange={showSearch ? this.handleInputChange : undefined}
        />
        {clearIcon}
        {inputIcon}
      </span>
    );

    let expandIcon = <RightOutlined />;

    const loadingIcon = (
      <span className={`${prefixCls}-menu-item-loading-icon`}>
        <RedoOutlined spin />
      </span>
    );

    const getPopupContainer = props.getPopupContainer || this.getContextPopupContainer;
    const rest = omit(props, ['inputIcon', 'expandIcon', 'loadingIcon', 'bordered']);
    return (
      <RcCascader
        {...rest}
        prefixCls={prefixCls}
        getPopupContainer={getPopupContainer}
        options={options}
        value={value}
        popupVisible={state.popupVisible}
        onPopupVisibleChange={this.handlePopupVisibleChange}
        onChange={this.handleChange}
        dropdownMenuColumnStyle={dropdownMenuColumnStyle}
        expandIcon={expandIcon}
        loadingIcon={loadingIcon}
        popupClassName={popupClassName}
        popupPlacement={this.getPopupPlacement()}
      >
        {input as React.ReactElement}
      </RcCascader>
    );
  }
}

export default EventCascader;
