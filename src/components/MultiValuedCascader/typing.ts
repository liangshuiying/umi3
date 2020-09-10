/**
 * 选项的值
 */
export type OptionValue = number | string;

/**
 * 配置参数 key为值，name为显示文案
 */
export interface IConfig {
    key: OptionValue;
    name: string;
}

/**
 * 下拉选项
 */
export interface OptionItemDTO {
    value: OptionValue;
    label: string;
    children?: OptionItemDTO[];
    level?: number;
}

/**
 * 返回的选中结果
 */
export type SelectedDTO = OptionValue[];

