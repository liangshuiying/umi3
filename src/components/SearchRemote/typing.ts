import { SelectValue } from 'antd/es/select';

export type RemoteCallback<T> = (data: T[]) => void;

export interface ISingleRemoteProps<ValueType extends SelectValue> {
  value?: ValueType;
  onChange?: (value: ValueType) => void;
  placeholder?: string;
  onSearch: (search: string, cb: RemoteCallback<ValueType>) => void;
  className?: string;
  style?: React.CSSProperties;
}
