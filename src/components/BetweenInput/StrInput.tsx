import React, { useState } from 'react';
import { Input } from 'antd';
import { isDigit } from '@/utils/utils';
import styles from './index.module.less';

export interface BetweenInputProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  seperator?: string;
}

const BetweenInput: React.FC<BetweenInputProps> = props => {
  const { value, onChange, seperator = '—' } = props;
  const [_value, setValue] = useState<string[]>([]);
  const getNums = (): string[] => {
    if (value) {
      return [...value];
    }
    return [..._value];
  };
  const triggerChange = (newVal: string[]) => {
    if (onChange) {
      onChange(newVal);
    }
  };
  const handleRemoveStrNum = (position: 0 | 1, value) => {
    if (value === '-' || value === '.') {
      const newNums = [...getNums()];
      newNums[position] = '';
      if (!('value' in props)) {
        setValue(newNums);
      }
      triggerChange(newNums);
    }
  };
  const handleChange = (position: 0 | 1, val: string) => {
    if (val !== null && val !== undefined) {
      if (val !== '' && !isDigit(val)) {
        return;
      }
      const valStr = `${val}`;
      if (valStr.length > 40) {
        return;
      }
    }
    const newNums = [...getNums()];
    newNums[position] = val;
    if (!('value' in props)) {
      setValue(newNums);
    }
    triggerChange(newNums);
  };
  return (
    <div className={styles.inputGroup}>
      <Input
        className={styles.seperatorInputLeft}
        placeholder="请输入"
        maxLength={40}
        value={getNums()[0] || ''}
        onChange={event => handleChange(0, event.target.value)}
        onBlur={event => handleRemoveStrNum(0, event.target.value)}
      />
      <span className={styles.seperatorInput}>{seperator}</span>
      <Input
        className={styles.seperatorInputRight}
        placeholder="请输入"
        value={getNums()[1] || ''}
        maxLength={40}
        onChange={event => handleChange(1, event.target.value)}
        onBlur={event => handleRemoveStrNum(1, event.target.value)}
      />
    </div>
  );
};

export default BetweenInput;
