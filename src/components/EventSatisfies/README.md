### Props

```shell
├── AndOrBar.tsx                # 且或组件
├── DynamicItem.tsx             # 核心动态组件
├── NewEventPortal.tsx
├── ParamItem.tsx               # 为标签规则组件对 DynamicItem 进一步封装
├── constants.ts                # 常量
├── index.module.less
├── index.module.less.d.ts
├── index.tsx
├── typing.ts
├── utils.ts                    # 封装常用工具函数
```

```typescript
// 规则 Props
interface IEventSatisfiesProps {
  value?: IEventRuleSeed[]; // 当前事件的列表
  type?: EnumRuleType; // 规则类型，默认 标签规则，可不传
  relation?: EnumRelationalOperator; // 事件间的关系
  eventKey: string; // 必传，用于关联emitevent
  onRelationChange?: (relation: EnumRelationalOperator) => void;
  onChange?: (value: IEventRuleSeed[]) => void;
}

// 参数组件 Props
// DynamicItem 组件分为三个部分：field/function/params
// field 指当前的事件参数列表部分
// function 指当前的操作符部分
// params 指当前的参数项的值
interface IDynamicItemProps {
  type?: EnumRuleType;              // 规则类型
  count: number;                    // 显示参数的序列
  params?: (string | undefined)[];  // 参数值
  function: TypeRelatioinFunction;  // 操作类型
  options: ParamEntity[];           // 可选参数列表
  disableFuture?: boolean;          // 禁止时间的未来选项
  timeFormat?: string;              // 时间格式化
  field: string;                    // 当前选择的参数 paramKey
  onChange: (field: string, val: any) => void; // 参数项发生变动时, field 是具体到 field, function, params
  onDel: () => void;
}
```

### 案例

```typescript
import React from 'react';
import { Layout, Row, Col, Radio } from 'antd';
import EventSatisfies from '@/components/EventSatisfies';
import { EnumRuleType } from '@/pages/Market/EventManage/Rule/typing';
const { Content } = Layout;

const EventSatisfiesDemo = () => {
  const handleAdd = () => {
    EventSatisfies.eventEmit.emit('add', { key: 'kaka' });
  }
  return (
    <Layout style={{ padding: 80, background: 'transparent' }}>
      <Row style={{ marginBottom: 20, marginTop: 20 }}>
        <Col span={24}>
          <Button onClick={handleAdd} type="primary">
            添加
          </Button>
        </Col>
      </Row>
      <Content>
        <Row>
          <Col span={24}>
            <EventSatisfies onChange={val => changeRuleRelation(val)} eventKey="kaka" />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default EventSatisfiesDemo;
```
