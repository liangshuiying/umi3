import React, { useState } from 'react';
import { InputNumber } from 'antd';
import styles from './index.module.less';

export type BetweenInputType = string | number;

export interface BetweenInputProps {
  value?: BetweenInputType[];
  onChange?: (value: BetweenInputType[]) => void;
  seperator?: string;
  min?: [number | undefined, number | undefined];
}

const BetweenInput: React.FC<BetweenInputProps> = props => {
  const { value, onChange, seperator = '—', min } = props;
  const [_value, setValue] = useState<BetweenInputType[]>([]);
  const getNums = (): BetweenInputType[] => {
    if (value) {
      return [...value];
    }
    return [..._value];
  };
  const triggerChange = (newVal: BetweenInputType[]) => {
    if (onChange) {
      onChange(newVal);
    }
  };
  const getmins = (): [number | undefined, number | undefined] => {
    if ('min' in props && min !== void 0) {
      return min;
    }

    return [undefined, undefined];
  };
  const handleChange = (position: 0 | 1, val: BetweenInputType) => {
    if (val !== null && val !== undefined) {
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
      <InputNumber
        className={styles.seperatorInputLeft}
        placeholder="请输入"
        min={getmins()[0]}
        value={getNums()[0] as number | undefined}
        onChange={newVal => handleChange(0, newVal as BetweenInputType)}
      />
      <span className={styles.seperatorInput}>{seperator}</span>
      <InputNumber
        className={styles.seperatorInputRight}
        placeholder="请输入"
        min={getmins()[1]}
        value={getNums()[1] as number | undefined}
        onChange={newVal => handleChange(1, newVal as BetweenInputType)}
      />
    </div>
  );
};

export default BetweenInput;
