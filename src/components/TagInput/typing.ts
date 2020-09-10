import { EnumParamType } from '@/pages/Market/EventManage/Param/typing';
import { CSSProperties } from 'react';

export interface IDataItem {
  key: string | number;
  value: string;
}

export interface ITagInputProps {
  mode?: 'multiple' | 'tags';
  value?: string[];
  valueType?: EnumParamType;
  onChange?: (value: string[]) => void;
  onFilter?: (value: string[]) => string[];
  data?: IDataItem[];
  placeholder?: string;
  maxTagTextLength?: number;
  styles?: CSSProperties;
  maxTagCount?: number;
}
