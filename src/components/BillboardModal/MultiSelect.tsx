
import MultiValuedCascader from '@/components/MultiValuedCascader';
import React, { useState } from 'react';
import { noop as _noop } from 'lodash';

const MultiSelect = ({ value = [], onChange = _noop, options }) => {
  console.log(value);
  const [selects, setSelects] = useState(value);

  const triggerChange = values => {
    console.log(values);
    setSelects(values);
    onChange && onChange(values);
  };

  return (
    <MultiValuedCascader
      options={options}
      defaultSelected={selects}
      config={{ key: 'value', name: 'label' }}
      onChange={triggerChange}
    />
  );
};

export default MultiSelect;