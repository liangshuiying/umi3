import React from 'react';
import { history } from 'umi';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import { Divider, Tooltip, DatePicker, Select, Input, Popover, Modal, message, Empty } from 'antd';
import { InfoCircleOutlined, SwapRightOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// eslint-disable-next-line import/no-extraneous-dependencies
import { RangeValue } from 'rc-picker/es/interface';
import moment, { Moment } from 'moment';
import { get as _get, forEach as _forEach, map as _map } from 'lodash';
import { getActiveData } from '@/pages/DataCenter/ActiveAnalysis/service';
import cache from '@/utils/store';
import ScrmTheme from '@/assets/SCRM.project.json';
import noDataImage from '@/assets/no_chart_data.svg';
import IconFont from '../IconFont';
import styles from './index.module.less';

echarts.registerTheme('SCRM', ScrmTheme.theme);

const { RangePicker } = DatePicker;

export const enum TrendChartType {
  LINE = 'line',
  BAR = 'bar',
}

export type FilterDateType = RangeValue<Moment>;
export type FilterCellType = 'MINUTE' | 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';

export type ChartStatus = 1 | 2;
export interface TrendChartProps {
  type?: 1 | 2; // 1:活跃分析,2:交易趋势
  id: number;
  status?: ChartStatus;
  title?: string;
  tags?: string[];
  rows?: StatisticsRow[];
  legends?: string[];
  series?: string[];
  reportTime?: string;
  onDel: () => Promise<any>;
}
export interface TrendChartStates {
  chartType: TrendChartType;
  title: string;
  tags: string[];
  series: string[];
  rows: StatisticsRow[];
  seperatorShow: boolean;
  filterDate: FilterDateType;
  filterCell: FilterCellType;
  loading: boolean;
  legends: string[];
  dropdownVisible: boolean;
}

class TrendChart extends React.Component<TrendChartProps, TrendChartStates> {
  constructor(props: TrendChartProps) {
    super(props);
    const endM = moment().startOf('d');
    const startM = moment(endM).subtract(365, 'd');
    const chartTypeCache = cache.get('DATA_CHART_TYPE_MAP', {});
    this.state = {
      dropdownVisible: false,
      chartType: chartTypeCache[props.id] || TrendChartType.LINE,
      title: props.title || '自定义标题',
      tags: props.tags || [],
      legends: props.legends || [],
      series: props.series || [],
      rows: props.rows || [],
      seperatorShow: true,
      filterDate: [startM, endM],
      filterCell: 'DAY',
      loading: false,
    };
  }

  echartsReact = React.createRef<ReactEcharts>();
  mapSeries = (legends: string[]) => {
    const { chartType, rows } = this.state;
    const series: number[][] = [];
    if (rows && rows.length && rows[0].values) {
      _forEach(rows[0].values, serie => {
        const tmp: number[] = [];
        const legendLength = legends.length;
        for (let index = 0; index < legendLength; index++) {
          tmp.push(serie[index]);
        }
        series.push(tmp);
      });
    }

    return _map(legends, (legend, index) => {
      const item: any = {
        name: legend,
        type: chartType,
        data: _map(series, index),
      };
      if (this.state.chartType === TrendChartType.BAR) {
        // item.barWidth = 3;
      }
      return item;
    });
  };
  getData = async (unit: FilterCellType, times: [Moment, Moment]) => {
    const { type, id } = this.props;
    this.setState({ loading: true });
    const newState: Partial<TrendChartStates> = { loading: false };
    if (times.length === 2 && id) {
      const [startM, endM] = times;
      const target = type === 1 ? 'ACTIVE' : 'TREND';
      const res = await getActiveData({
        id,
        startTime: startM.unix() * 1000,
        endTime: endM.unix() * 1000,
        target,
        cycle: unit
      });
      if (res.status === 1) {
        const {
          data: { statistics },
        } = res;
        const { series, rows } = statistics;
        newState.filterCell = unit;
        newState.rows = rows;
        newState.series = series;
        newState.filterDate = times;
      } else {
        res.error && res.error.message && message.error(res.error.message);
      }

      this.setState(newState as TrendChartStates);
    }
  };
  getXaxisData = () => {
    const { series, filterCell } = this.state;
    //console.log('series============', series)
    switch (filterCell) {
      case 'MINUTE':
        return _map(series, s => moment(s).format('H:mm'));
      case 'HOUR':
        return _map(series, s => moment(s).format('M-D H:mm'));
      case 'DAY':
        return _map(series, s => moment(s).format('M-D'));
      case 'WEEK':
        return _map(series, s => moment(s).format('M-D当周'));
      case 'MONTH':
        return _map(series, s => moment(s).format('M月'));
      default:
        return series;
    }
  };
  getOption = () => {
    const { legends } = this.state;
    const series = this.mapSeries(legends);
    const xAxisData = this.getXaxisData();
    const config: echarts.EChartOption<echarts.EChartOption.Series> = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        left: 40,
        textStyle: {
          lineHeight: 32,
          fontSize: 12,
        },
        data: legends || [],
      },
      grid: {
        top: 56,
        left: 40,
        right: 40,
        bottom: 72,
        containLabel: true,
      },
      dataZoom: [
        {
          type: 'slider',
          bottom: 24,
          height: 24,
        } as echarts.EChartOption.DataZoom,
      ],
      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
        splitNumber: 4,
        axisLine: {
          lineStyle: {
            width: 0,
          },
        },
        axisTick: {
          lineStyle: {
            width: 0,
          },
        },
      },
      series,
    };

    return config;
  };
  handleChangeChartType = (val: TrendChartType) => {
    this.setState(
      {
        chartType: val,
      },
      () => {
        const oldTypeMap = cache.get('DATA_CHART_TYPE_MAP', {});
        oldTypeMap[this.props.id] = val;
        cache.set('DATA_CHART_TYPE_MAP', oldTypeMap);
      },
    );
  };
  handleChangeOpen = (open: boolean) => {
    if (open === false) {
      const noPick =
        _get(this.state.filterDate, 0) === null || this.state.filterDate === void 0 || this.state.filterDate === null;
      this.setState({
        seperatorShow: !noPick,
      });
    } else {
      this.setState({
        seperatorShow: true,
      });
    }
  };
  handleChangeFilterDate = async (values: FilterDateType) => {
    if (values && values.length === 2) {
      const startM = values[0] as Moment;
      const endM = values[1] as Moment;
      if (this.state.filterCell === 'MINUTE') {
        const endMWithOneday = moment(endM).subtract(1, 'd');
        if (startM.isBefore(endMWithOneday) || startM.isAfter(endM)) {
          message.error('按分钟查看最长支持时间周期为1天');
          return;
        }
      } else if (this.state.filterCell === 'HOUR') {
        const endMWithOneday = moment(endM)
          .subtract(7, 'd')
          .startOf('d');
        if (startM.isBefore(endMWithOneday) || startM.isAfter(endM)) {
          message.error('按小时查看最长支持时间周期为1周');
          return;
        }
      }
      await this.getData(this.state.filterCell, [startM, endM]);
    }
    this.setState({ seperatorShow: values !== null });
  };
  handleChangeFilterCell = async (val: FilterCellType) => {
    const { filterDate } = this.state;
    if (filterDate && filterDate.length === 2) {
      let startM = filterDate[0] as Moment;
      let endM = filterDate[1] as Moment;
      if (val === 'MINUTE') {
        const endMWithOneday = moment(endM).subtract(1, 'd');
        if (startM.isBefore(endMWithOneday) || startM.isAfter(endM)) {
          message.warning('按分钟查看最长支持时间周期为1天');
          startM = endMWithOneday;
        }
      } else if (val === 'HOUR') {
        const endMWithOneday = moment(endM)
          .subtract(7, 'd')
          .startOf('d');
        if (startM.isBefore(endMWithOneday) || startM.isAfter(endM)) {
          message.warning('按小时查看最长支持时间周期为1周');
          startM = endMWithOneday;
        }
      }
      await this.getData(val, [startM, endM]);
    }
  };
  gotoEdit = () => {
    const { type = 1, id } = this.props;
    if (type === 2) {
      history.push(`/decision/business/trend/edit?id=${id}`);
    } else if (type === 1) {
      history.push(`/decision/member/active/edit?id=${id}`);
    }
  };
  handleDel = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: '删除后该看板将无法恢复，是否确定删除？',
      onOk: () => {
        return this.props.onDel();
      },
    });
  };
  getTagsDom = () => {
    const tmp = [...this.state.tags];
    if (tmp.length > 10) {
      tmp.length = 10;
      tmp.push('......');
    }
    return (
      <div>
        {
          <p>
            更新时间: {this.props.reportTime ? moment(this.props.reportTime).format('YYYY-MM-DD HH:mm') : '正在计算'}
          </p>
        }
        <p style={{ margin: 0 }}>筛选标签：</p>
        {tmp.length === 0
          ? '全量用户'
          : _map(tmp, (tag, index) => {
            return (
              <p style={{ margin: 0 }} key={index}>
                {tag}
              </p>
            );
          })}
      </div>
    );
  };

  handlePopoverVisible = visible => {
    this.setState({
      dropdownVisible: visible,
    });
  };
  render() {
    const tagsDom = this.getTagsDom();
    return (
      <div className={styles.wrap}>
        <div className={styles.header}>
          <div className={styles.dashboardTitle}>
            <Divider type="vertical" className={styles.dashboardTitleDecorate} />
            {this.state.title}
            <Tooltip title={tagsDom}>
              <InfoCircleOutlined className={styles.tipIcon} />
            </Tooltip>
          </div>
          <div className={styles.filter}>
            <Input.Group compact>
              <RangePicker
                disabled={this.state.loading}
                placeholder={['选择时间段', '']}
                showTime={{
                  hideDisabledOptions: true,
                }}
                allowClear={false}
                className={styles.filterDate}
                separator={this.state.seperatorShow ? <SwapRightOutlined /> : false}
                value={this.state.filterDate}
                onChange={this.handleChangeFilterDate}
                onOpenChange={this.handleChangeOpen}
                format="YYYY-MM-DD HH:mm:ss"
              />
              <Select value={this.state.chartType} onChange={this.handleChangeChartType} loading={this.state.loading}>
                <Select.Option value={TrendChartType.LINE}>折线图</Select.Option>
                <Select.Option value={TrendChartType.BAR}>柱状图</Select.Option>
              </Select>
              <Select value={this.state.filterCell} className={styles.lastSelect} onChange={this.handleChangeFilterCell} loading={this.state.loading}>
                <Select.Option value="MINUTE">按分钟</Select.Option>
                <Select.Option value="HOUR">按小时</Select.Option>
                <Select.Option value="DAY">按天</Select.Option>
                <Select.Option value="WEEK">按周</Select.Option>
                <Select.Option value="MONTH">按月</Select.Option>
              </Select>
            </Input.Group>
            <Popover
              onVisibleChange={this.handlePopoverVisible}
              placement="bottomLeft"
              overlayStyle={{ paddingLeft: 0, paddingRight: 0 }}
              trigger="click"
              content={
                <div className={styles.actions}>
                  <span className={styles.action} onClick={this.gotoEdit}>
                    编辑
                  </span>
                  <Divider type="vertical" />
                  <span className={styles.action} onClick={this.handleDel}>
                    删除
                  </span>
                </div>
              }
            >
              <IconFont
                className={styles.actionTrigger}
                type={this.state.dropdownVisible ? 'icon-operating_2' : 'icon-operating_1'}
              />
            </Popover>
          </div>
        </div>
        <div className={styles.chart}>
          {this.state.series.length && this.props.status === 1 ? (
            <ReactEcharts
              ref={this.echartsReact}
              option={this.getOption()}
              theme="SCRM"
              style={{ width: '100%', height: '100%' }}
              showLoading={this.state.loading}
              loadingOption={{
                color: 'rgba(24, 144, 255, 1)',
                textColor: 'rgba(24, 144, 255, 1)',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0,
              }}
            />
          ) : (
              <Empty
                description={this.props.status === (2 as ChartStatus) ? '正在计算中' : '暂无统计数据'}
                image={noDataImage}
                imageStyle={{ height: 28, width: 28 }}
                style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              />
            )}
        </div>
      </div>
    );
  }
}

export default TrendChart;
