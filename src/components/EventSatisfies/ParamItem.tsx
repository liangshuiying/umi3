import React from 'react';
import { EnumRuleType } from '@/pages/Market/EventManage/Rule/typing';
import { ParamEntity } from '@/pages/Market/EventManage/Param/typing';
import { split as _split } from 'lodash';
import { ISubFilter } from './typing';
import DynamicItem from './DynamicItem';

interface IParamItemProps {
  type: EnumRuleType;
  count: number;
  options: ParamEntity[];
  data: ISubFilter;
  onChange: (field: string, val: any) => void;
  onDel: () => void;
}

class ParamItem extends React.Component<IParamItemProps> {
  render() {
    const { type, count, onChange, options, data, onDel } = this.props;
    const fieldList = _split(data.field, '.');
    const fieldVal = fieldList.length ? fieldList[fieldList.length - 1] : '';
    const eventName = fieldList.length ? fieldList[fieldList.length - 2] : '';
    return (
      <DynamicItem
        type={type}
        count={count}
        onChange={onChange}
        eventName={eventName}
        filterSeed={data.filterSeed}
        options={options}
        field={fieldVal}
        function={data.function}
        params={data.params}
        onDel={onDel}
      />
    );
  }
}

export default ParamItem;
