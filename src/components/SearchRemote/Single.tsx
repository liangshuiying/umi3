import React from 'react';
import { Select, Spin } from 'antd';
import _map from 'lodash/map';
import { SelectValue, LabeledValue } from 'antd/es/select';
import { useDebounce } from 'react-use';
import useSetState from '@/hooks/useSetState';
import { ISingleRemoteProps } from './typing';

const { Option } = Select;

function SingleRemote<T extends SelectValue = SelectValue>(props: ISingleRemoteProps<T>) {
  const { value, placeholder = '请选择/输入', onChange, onSearch, style } = props;
  const [state, setState] = useSetState<{
    data: T[];
    _value?: T;
    search: string;
    fetching: boolean;
  }>({
    data: [],
    _value: undefined,
    search: '',
    fetching: false,
  });
  const fetchData = () => {
    if (state.search) {
      setState({ fetching: true });
      onSearch(state.search, data => {
        setState({ data, fetching: false });
      });
    } else {
      setState({
        data: [],
      });
    }
  };
  const handleSearch = (str: string) => {
    setState({ search: str });
  };

  useDebounce(fetchData, 500, [state.search]);

  const triggerChange = (value: T) => {
    if (onChange) {
      onChange(value);
    }
  };
  const handleChange = (newVal: T) => {
    if (!('value' in props)) {
      setState({
        _value: newVal,
      });
    }
    triggerChange(newVal);
  };
  const currentSelect = value || state._value;
  const options = _map(state.data, (item: LabeledValue) => (
    <Option key={item.value} value={item.value}>
      {item.label}
    </Option>
  ));
  return (
    <Select
      showSearch
      value={currentSelect}
      placeholder={placeholder}
      style={style || { width: '100%' }}
      defaultActiveFirstOption={false}
      labelInValue
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={state.fetching ? <Spin size="small" /> : null}
    >
      {options}
    </Select>
  );
}

export default SingleRemote;
