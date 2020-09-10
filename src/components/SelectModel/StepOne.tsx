import video1 from '@/assets/videos/1.mp4';
import React from 'react';
import { Input, Spin } from 'antd';
import IconFont from '@/components/IconFont/index';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';

const { Search } = Input;

export interface StepOneProps {
  handleSearch: Function;
  getSelectedList: Function;
  total: number;
  type: string;
}

export interface StepOneState {
  loading: boolean;
  showUrl: string;
  selectedList: SelectedLists | any[];
}
export interface SelectedLists {
  id: string | number;
  appLogo: string;
}


export default class StepOne extends React.Component<StepOneProps, StepOneState> {
  state = {
    loading: false,
    selectedList: [],
    showUrl: ''
  };

  // 选择
  toggleChecked = (val: SelectedLists) => {
    const { selectedList } = this.state;
    let res = selectedList.findIndex((item: SelectedLists) => item.id === val.id);
    if (res === -1) {
      // 不存在，加上
      selectedList.splice(res, 0, val);
    } else {
      // 存在，删除
      selectedList.splice(res, 1);
    }
    this.setState(
      {
        selectedList,
      },
      () => {
        this.props.getSelectedList(this.state.selectedList);
      },
    );
  };

  changeScrollStyle = ({ style, ...props }) => {
    const thumbStyle = {
      width: '4px',
      backgroundColor: '#c6d0df',
      borderRadius: '2px',
    };
    return (
      <div
        style={{ ...style, ...thumbStyle }}
        {...props}
      />
    )
  }

  render() {
    const { loading, selectedList } = this.state;
    const { type } = this.props;

    // 搜索
    const onSearch = value => {
      this.props.handleSearch(value);
    };

    const placeholderList = {
      'pic': '图片名称',
      'video': '视频名称',
      'arc': '图文标题'
    };

    let list = [
      { id: '1', name: '图片1', url: '', appLogo: 'http://t8.baidu.com/it/u=3571592872,3353494284&fm=79&app=86&f=JPEG?w=1200&h=1290' },
      {
        id: '2',
        name: '图片2',
        url: '',
        appLogo: 'http://www.baidu.com/img/bd_logo1.png',
      },
      {
        id: '3',
        name: '图片3',
        url: '',
        appLogo: 'http://t8.baidu.com/it/u=2247852322,986532796&fm=79&app=86&f=JPEG?w=1280&h=853',
      },
      { id: '4', name: '图片4', url: '', appLogo: 'http://t8.baidu.com/it/u=3571592872,3353494284&fm=79&app=86&f=JPEG?w=1200&h=1290' },
      { id: '5', name: '图片1', url: '', appLogo: 'http://t8.baidu.com/it/u=3571592872,3353494284&fm=79&app=86&f=JPEG?w=1200&h=1290' },
      {
        id: '6',
        name: '图片2',
        url: '',
        appLogo: 'http://www.baidu.com/img/bd_logo1.png',
      },
      {
        id: '7',
        name: '图片3',
        url: '',
        appLogo: 'http://t8.baidu.com/it/u=2247852322,986532796&fm=79&app=86&f=JPEG?w=1280&h=853',
      },
      { id: '8', name: '图片4', url: '', appLogo: 'http://t8.baidu.com/it/u=3571592872,3353494284&fm=79&app=86&f=JPEG?w=1200&h=1290' },
      { id: '9', name: '图片1', url: '', appLogo: 'http://t8.baidu.com/it/u=3571592872,3353494284&fm=79&app=86&f=JPEG?w=1200&h=1290' },
      {
        id: '10',
        name: '图片2',
        url: '',
        appLogo: 'http://www.baidu.com/img/bd_logo1.png',
      },
      {
        id: '11',
        name: '图片3',
        url: '',
        appLogo: 'http://t8.baidu.com/it/u=2247852322,986532796&fm=79&app=86&f=JPEG?w=1280&h=853',
      },
      {
        id: '12', name: '图片4', url: '',
        appLogo: 'http://t8.baidu.com/it/u=3571592872,3353494284&fm=79&app=86&f=JPEG?w=1200&h=1290'
      },
      {
        id: '13', name: '图片4', url: '',
        appLogo: 'http://t8.baidu.com/it/u=3571592872,3353494284&fm=79&app=86&f=JPEG?w=1200&h=1290'
      },
    ];

    const getLiList = () => {
      const option =
        list &&
        list.length &&
        list.map((item: SelectedLists, idx: number) => {
          let ischecked = selectedList.findIndex((val: any) => val.id === item.id);
          return (
            <li
              key={`mod_li` + item.id}
              className={`${idx && (idx + 1) % 4 === 0 ? styles.noMar : styles.lis}`}
              onClick={e => {
                e.stopPropagation();
                this.toggleChecked(item);
              }}
            >
              {
                // 图片
                type === 'pic' ? <>
                  <img src={item.appLogo} className={styles.imgs} alt="" />
                  <h4 className={styles.titles}>图片名称</h4>
                  <div className={`${styles.mengCeng} ${ischecked === -1 ? '' : styles.checkedLi}`}>
                    {
                      ischecked === -1 ? null : <IconFont
                        className={styles.selectIcon}
                        type={'icon-Select'}
                      />
                    }
                    <a target='_blank'
                      href={item.appLogo}
                      className={styles.details}
                      onClick={
                        (e) => {
                          e.stopPropagation();
                        }
                      }
                    >查看</a>

                  </div>
                </> : null
              }
              { // 视频
                type === 'video' ?
                  <div className={`${styles.mengCeng}`}>
                    <video src={video1} className={styles.imgs} controls={true} />
                    <h4 className={styles.titles}>视频名称</h4>
                    {
                      ischecked === -1 ? null : <IconFont
                        className={styles.selectIcon}
                        type={'icon-Select'}
                      />
                    }
                    <a target='_blank'
                      href={video1}
                      className={styles.details}
                      onClick={
                        (e) => {
                          e.stopPropagation();
                        }
                      }
                    >查看</a>
                  </div> : null
              }
            </li>
          );
        });
      return option;
    };

    return (
      <Spin spinning={loading}>
        <div className={styles.modalheader}>
          <Search
            placeholder={placeholderList[type]}
            onSearch={onSearch}
            style={{ width: 245 }}
          />
        </div>
        <div className={styles.modalcontent}>
          <ul className={styles.dataList}>
            <Scrollbars
              style={{ width: 710, height: 426 }}
              renderThumbVertical={this.changeScrollStyle}
            >
              {
                getLiList()
              }
            </Scrollbars>
          </ul>
        </div>
      </Spin>
    );
  }
}
