import positiveInfinite from '@/assets/infinite_1@2x.png';
import negativeInfinite from '@/assets/infinite_2@2x.png';
import styles from './style.module.less';
import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { InputNumber, Row, Col, message } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';

interface InputNumberProps {
  onClose: Function;
  index: number;
  hasClose: boolean;
  [index: string]: any;
}
const InputNumberAppendClose: React.FC<InputNumberProps> = ({
  value,
  onChange,
  hasClose,
  index,
  onClose,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);

  const inputChange = value => {
    setInputValue(!Number.isNaN(parseFloat(value)) ? parseFloat(value) : '');
  };

  const triggerChange = () => {
    onChange(inputValue);
  };

  const inputKeyDown = e => {
    if ((e.keyCode !== 8 && e.keyCode < 48) || (e.keyCode > 57 && e.keyCode !== 189 && e.keyCode !== 190)) {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.inputNumberAppendClose}>
      <InputNumber
        value={inputValue}
        onKeyDown={inputKeyDown}
        onChange={inputChange}
        onBlur={triggerChange}
        maxLength={13}
        {...props}
      />
      {hasClose && <CloseCircleFilled className="close" onClick={() => onClose(index)} />}
    </div>
  );
};

const IntervalInputByEdit: React.FC = ({ value = [''], onChange, extra }) => {
  const [rangeValue, setRangeValue] = useImmer(value);

  useEffect(() => {
    onChange(rangeValue);
  }, [rangeValue]);

  const removeNumberInput = index => {
    setRangeValue(state => {
      state.splice(index, 1);
    });
  };

  const handleAdd = () => {
    if (rangeValue.length === 9) {
      message.error('区间输入框不能超过9个');
      return;
    }
    setRangeValue(state => {
      state.push('');
    });
  };

  const handleChange = (inputValue, index) => {
    setRangeValue(state => {
      state[index] = inputValue;
    });
  };

  return (
    <>
      <Row className={styles.intervalInputByEdit}>
        <Col flex="23px">
          <img src={negativeInfinite} width="28" />
        </Col>
        <Col flex="23px">
          <span> - </span>
        </Col>
        {rangeValue.map((item, index) =>
          index !== rangeValue.length - 1 ? (
            <React.Fragment key={`Fragment_${Math.random() + index}`}>
              <Col flex="102px">
                <InputNumberAppendClose
                  placeholder="请输入"
                  hasClose={index > 0}
                  onClose={removeNumberInput}
                  onChange={value => handleChange(value, index)}
                  index={index}
                  value={item}
                  // min={index > 0 ? (rangeValue.length && rangeValue[index - 1] ? rangeValue[index - 1] + 1 : 1) : 1}
                />
              </Col>
              <Col flex="23px">
                <span> - </span>
              </Col>
            </React.Fragment>
          ) : (
            <Col key={`Col_${Math.random() + index}`} flex="102px">
              <InputNumberAppendClose
                placeholder="请输入"
                hasClose={index > 0}
                onClose={removeNumberInput}
                onChange={value => handleChange(value, index)}
                index={index}
                value={item}
              />
            </Col>
          ),
        )}
        <Col flex="23px">
          <span> - </span>
        </Col>
        <Col flex="23px">
          <img src={positiveInfinite} width="28" />
        </Col>
        {rangeValue.length < 9 && (
          <Col>
            <a className="add" onClick={handleAdd}>
              <i> + </i>添加区间
            </a>
          </Col>
        )}
      </Row>
      {extra}
    </>
  );
};

export default IntervalInputByEdit;
