import React from 'react';
import { Button } from 'antd';
import cls from 'classnames';
import styles from './index.module.less';
import { EnumRelationalOperator } from './typing';

// 表达式操作符
export const EXP_MAP = {
  and: '且',
  or: '或',
};

export interface AndOrBarProps {
  exp: EnumRelationalOperator;
  onSwitch?: (value: EnumRelationalOperator) => any;
  show?: boolean;
  isNoPadding?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const AndOrBar: React.FC<AndOrBarProps> = props => {
  const { exp, onSwitch, children, show = false, className, style, isNoPadding = false } = props;
  const handleSwitch = () => {
    if (onSwitch) {
      onSwitch(exp === EnumRelationalOperator.AND ? EnumRelationalOperator.OR : EnumRelationalOperator.AND);
    }
  };
  return (
    <div
      className={cls(styles.andOrBarWrap, styles.expLayout, className,
        show ? '' : (isNoPadding ? styles.hidden2 : styles.hidden), {
        [styles.noChild]: children === null,
      })}
      style={style}
    >
      {
        show ? (
          <div className={styles.expWrap} >
            <Button
              className={styles.expName}
              shape="circle"
              type="primary"
              size="small"
              ghost={exp === 'or'}
              onClick={handleSwitch}
            >
              {EXP_MAP[exp]}
            </Button>
            <span className={styles.expLine} />
          </div>
        ) : null}
      {children}
    </div >
  );
};

export default AndOrBar;
