import ScrmTheme from '@/assets/SCRM.project.json';
import noneImg from '@/assets/home/default_home_nodata.svg';
import React, { useCallback, useMemo, useEffect } from 'react';
import echarts from 'echarts';
import { Empty } from 'antd';

import ReactEcharts, { ObjectMap } from 'echarts-for-react'; // or var ReactEcharts = require('echarts-for-react');

export interface ColumnChartProps {
  yAxis: string[];
  data: number[];
  total: number;
  status: 1 | 2;
}
echarts.registerTheme('scrm_theme', ScrmTheme.theme);

function fillText(str) {
  let l = 8;

  if (str.length < l)
    return (
      Array(l - str.length)
        .fill(' ')
        .join('') + str
    );
  return str;
}

// NOTE: 直方图
export const ColumnChart: React.FC<ColumnChartProps> = ({ yAxis, data, total, status }) => {
  // TODO: shouldUpdateComponent

  // console.log(yAxis); // ["-INF~12", "12~40", "40~INF", "未知"]

  yAxis = yAxis.map(item => {
    let splitArr = item.split('~');

    if (splitArr[0] === '-INF') {
      return splitArr[1] + '以下';
    }
    if (splitArr[1] === 'INF') {
      return splitArr[0] + '以上';
    }
    return item;
  });

  console.log(yAxis.map(item => (item.length > 8 ? item.substr(0, 8) + '...' : item)).map(fillText));

  function getOption() {
    const _d = data.map(item => {
      return ((item / total) * 100).toFixed(2);
    });
    console.log(_d);
    const option = {
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'none',
        },
      },
      grid: {
        left: '3%',
        // right: '0.5%',
        bottom: '3%',
        top: '2%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      yAxis: {
        type: 'category',
        data: yAxis.map(item => (item.length > 5 ? item.substr(0, 5) + '...' : item)).map(fillText),
      },
      series: [
        {
          type: 'bar',
          data: _d,
          label: {
            show: true,
            position: 'right',
            formatter: '{c}%',
          },
          barMaxWidth: 80,
          barMinHeight: 5,
          tooltip: {
            formatter({ name, dataIndex, value }) {
              name = yAxis[dataIndex];
              const v = data[dataIndex];
              return `${name}<br/>人数: ${v}<br/>百分比: ${value}%`;
            },
          },
        },
      ],
    };
    console.log('直方图重新渲染');
    return option;
  }

  const options = useMemo(getOption, [yAxis, data, total]);

  if (total === 0) {
    return (
      <Empty
        image={noneImg}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 350,
        }}
        imageStyle={{ height: 28 }}
        description={status === 2 ? '正在计算中' : '暂无统计数据'}
      />
    );
  }

  return (
    <ReactEcharts
      option={options}
      notMerge={true}
      lazyUpdate={true}
      style={{ height: '350px' }}
      theme={'scrm_theme'}
      // onChartReady={onChartReadyCallback}
      // onEvents={EventsDict}
      opts={{}}
    />
  );
};

// 环形图
export interface AnnularChartProps {
  data: {
    name: string;
    value: number;
  }[];
  total: number;
  status: 1 | 2;
}

export const AnnularChart: React.FC<AnnularChartProps> = ({ data, total, status }) => {
  function getOption() {
    const d = data.map(item => {
      let splitArr = item.name.split('~');

      if (splitArr[0] === '-INF') {
        item.name = splitArr[1] + '以下';
      }
      if (splitArr[1] === 'INF') {
        item.name = splitArr[0] + '以上';
      }

      return {
        name: `${item.name}\n${((item.value / total) * 100).toFixed(2)}%`,
        value: ((item.value / total) * 100).toFixed(2),
      };
    });
    // console.log(d);
    const option = {
      hoverOffset: 1,
      tooltip: {
        formatter({ name, dataIndex, value }) {
          name = name.replace('~INF', '以上');
          const v = data[dataIndex].value;
          return `${name}<br/>人数: ${v}<br/>百分比: ${value}%`;
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: true,
          minAngle: 20,
          // selectedMode: 'single',
          label: {
            position: 'outer',
            alignTo: 'labelLine',
            distanceToLabelLine: 5,
            show: true,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '12',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: true,
            length: 30,
            length2: 20,
          },
          data: d,
        },
      ],
    };

    console.log('环状图重新渲染');
    return option;
  }

  const options = useMemo(getOption, [data, total]);

  if (total === 0) {
    return (
      <Empty
        image={noneImg}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 350,
        }}
        imageStyle={{ height: 28 }}
        description={status === 2 ? '正在计算中' : '暂无统计数据'}
      />
    );
  }

  return (
    <ReactEcharts
      option={options}
      notMerge={true}
      lazyUpdate={true}
      style={{ height: '350px' }}
      theme={'scrm_theme'}
      // onChartReady={onChartReadyCallback}
      // onEvents={EventsDict}
      opts={{}}
    />
  );
};
