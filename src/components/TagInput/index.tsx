import React from 'react';
import { filter as _filter, stubTrue as _stubTrue, find as _find, includes as _includes } from 'lodash';
import { Select } from 'antd';
import { isNumberString } from '@/utils/utils';
import { EnumParamType } from '@/pages/Market/EventManage/Param/typing';
import { ITagInputProps } from './typing';
import styles from './index.module.less';

const { Option } = Select;

const TagInput: React.FC<ITagInputProps> = ({
  mode = 'tags',
  value,
  onChange,
  onFilter,
  data = [],
  valueType = EnumParamType.TEXT,
  placeholder = '请选择/输入',
  maxTagTextLength = 9,
  maxTagCount = 0,
  styles: compStyles = {},
}) => {
  const [_value, setValue] = React.useState<string[]>([]);

  const triggerChange = (value: string[]) => {
    if (onChange) {
      onChange(value);
    }
  };

  const handleChange = (newValue: string[]) => {
    if (maxTagCount && newValue.length > maxTagCount) {
      return;
    }
    const filterMethod = valueType === EnumParamType.NUM ? isNumberString : _stubTrue;
    let filterValue = onFilter ? onFilter(newValue) : _filter(newValue, filterMethod);
    if (valueType === EnumParamType.ENUM) {
      const newVal: string[] = [];

      filterValue.forEach(val => {
        const targetByKey = _find(data, { key: val });
        // 如果是在字典key里面
        if (targetByKey) {
          // 如果不在新的数组中，push 进数组
          // 否则忽略这个值
          if (!_includes(newVal, val)) {
            newVal.push(val);
          }
        } else {
          const targetByValue = _find(data, { value: val });
          // 如果在字典值里面
          if (targetByValue) {
            const tmp = targetByValue.key as string;
            // 如果这个值对应字典中的key不在新数组，push key 进数组
            if (!_includes(newVal, tmp)) {
              newVal.push(tmp);
            }
          } else {
            newVal.push(val);
          }
        }
      });

      filterValue = newVal;
    }
    if (!value) {
      setValue(filterValue);
    }
    triggerChange(filterValue);
  };

  const filterOption = (input: string, option: any) => {
    if (valueType === EnumParamType.ENUM) {
      return (
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
        option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    }

    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  return (
    <Select<string[]>
      mode={mode}
      style={{ width: '100%', ...compStyles }}
      onChange={handleChange}
      tokenSeparators={[',']}
      value={value || _value}
      placeholder={placeholder}
      className={styles.wrap}
      maxTagTextLength={maxTagTextLength}
      filterOption={(input, option) => filterOption(input, option)}
    >
      {data.map(item => (
        <Option key={item.key} value={item.key}>
          {item.value}
        </Option>
      ))}
    </Select>
  );
};

export default TagInput;
