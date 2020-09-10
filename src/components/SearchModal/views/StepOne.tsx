import video1 from '@/assets/videos/1.mp4';
import { PlusOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import React from 'react';
import { Input, Popover, Typography, Spin, Select } from 'antd';
import styles from '../SearchModal.less';

const { Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

export interface StepOneProps {
  handleSearch: Function;
  getSelectedList: Function;
  total: number;
  type: string;
  currentStep: number;
  selectOps: any;
}

export interface StepOneState {
  loading: boolean;
  selectedList: SelectedLists | any[];
  curPage: number;
}
export interface SelectedLists {
  id: string | number;
}
const types = {
  pic: 6,
  video: 3,
  arc: 3,
  text: 6,
};

export default class StepOne extends React.Component<StepOneProps, StepOneState> {
  state = {
    loading: false,
    selectedList: [],
    curPage: 1,
  };

  // 选择
  toggleChecked = (val: SelectedLists) => {
    const { selectedList } = this.state;
    let res = selectedList.findIndex(item => item.id === val.id);
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

  render() {
    const { curPage, loading, selectedList } = this.state;
    const { total, type, currentStep, selectOps } = this.props;
    let maxPage = Math.ceil(total / types[type]);
    // 上一页
    const getPrevData = () => {
      this.setState({
        loading: true,
      });
      if (curPage - 1 >= 1) {
        this.setState({
          curPage: curPage - 1,
          loading: false,
        });
      }
    };

    // 下一页
    const getNextData = () => {
      this.setState({
        loading: true,
      });
      if (curPage + 1 <= maxPage) {
        this.setState({
          curPage: curPage + 1,
          loading: false,
        });
      }
    };
    // 搜索
    const onSearch = value => {
      this.props.handleSearch(value);
    };

    let list = [
      { id: '1', name: '图片1', url: '', appLogo: 'http://www.baidu.com/img/bd_logo1.png' },
      {
        id: '2',
        name: '图片2',
        url: '',
        appLogo: 'http://t8.baidu.com/it/u=3571592872,3353494284&fm=79&app=86&f=JPEG?w=1200&h=1290',
      },
      {
        id: '3',
        name: '图片3',
        url: '',
        appLogo: 'http://t8.baidu.com/it/u=2247852322,986532796&fm=79&app=86&f=JPEG?w=1280&h=853',
      },
      { id: '4', name: '图片4', url: '', appLogo: 'http://www.baidu.com/img/bd_logo1.png' },
    ];
    let arcList = [
      { id: '1', name: '图片1', url: '', appLogo: 'http://www.baidu.com/img/bd_logo1.png' },
      {
        id: '2',
        name: '图片2',
        url: '',
        appLogo: 'http://t8.baidu.com/it/u=3571592872,3353494284&fm=79&app=86&f=JPEG?w=1200&h=1290',
      },
      {
        id: '3',
        name: '图片3',
        url: '',
        appLogo: 'http://t8.baidu.com/it/u=2247852322,986532796&fm=79&app=86&f=JPEG?w=1280&h=853',
      },
    ];

    let list2 = [
      { id: '1', errorMessage: '图片名称大小超过2M,图片名称大小超过2M,图片名称大小超过2M,' },
      { id: '2', errorMessage: '图片名称大小超过2M,图片名称大小超过2M,图片名称大小超过2M,' },
    ];

    const PopView: React.SFC = () => {
      return (
        <ul className={styles.errorContent}>
          {list2 &&
            list2.length &&
            list2.map((item, idx) => {
              return (
                <li
                  key={`res_li` + idx}
                  className={`${idx && idx + 1 === list2.length ? styles.paddings : styles.hasBorder} ${styles.error}`}
                >
                  {item.errorMessage}
                </li>
              );
            })}
        </ul>
      );
    };

    const getLiListOne = () => {
      if (type === 'pic' || type === 'text') {
        const option =
          list &&
          list.length &&
          list.map((item: any, idx: number) => {
            let ischecked = selectedList.findIndex((val: any) => val.id === item.id);
            return (
              <li
                key={`mod_li` + item.id}
                className={`${idx && (idx + 1) % 3 === 0 ? styles.noMar : styles.lis} ${
                  ischecked === -1 ? '' : styles.checkedLi
                  }`}
                onClick={this.toggleChecked.bind(null, item)}
              >
                {// 图片
                  type === 'pic' ? <img src={item.appLogo} className={styles.imgs} alt="" /> : ''}
                {// 文本
                  type === 'text' ? (
                    <div className={styles.texts}>
                      <h4>文本标题文本标题文本标题文本标题</h4>
                      <Paragraph ellipsis={{ rows: 3 }}>
                        这是一段关于文本的详细描述这是一段关于文本的详细描述这是一段关于文本的详细描述这是一段关于文本的详细描述
                    </Paragraph>
                    </div>
                  ) : (
                      ''
                    )}
              </li>
            );
          });
        return option;
      } else {
        const option =
          arcList &&
          arcList.length &&
          arcList.map((item: any, idx: number) => {
            let ischecked = selectedList.findIndex((val: any) => val.id === item.id);
            return (
              <li
                key={`mod_li` + item.id}
                className={`${idx && (idx + 1) % 3 === 0 ? styles.noMar : styles.lis} ${
                  ischecked === -1 ? '' : styles.checkedLi
                  }`}
                onClick={this.toggleChecked.bind(null, item)}
                style={{ height: '276px', textAlign: 'center' }}
              >
                {// 文章
                  type === 'arc' ? (
                    <div className={styles.arcs}>
                      <h4 style={{ padding: '0 16px' }}>文章标题文章标题文章标题文章标题</h4>
                      <img src={item.appLogo} className={styles.arcimgs} alt="" />
                      <div style={{ padding: '10px 16px 0' }}>
                        <Paragraph ellipsis={{ rows: 4 }}>
                          这是一段关于文章的详细描述这是一段关于文章的详细描述这是一段关于文章的详细描述这是一段关于文章的详细描述
                      </Paragraph>
                      </div>
                    </div>
                  ) : (
                      ''
                    )}
                {// 视频
                  type === 'video' ? <video src={video1} className={styles.vids} controls /> : ''}
              </li>
            );
          });
        return option;
      }
    };

    const getLiListThree = () => {
      if (type === 'pic' || type === 'text') {
        const option =
          list &&
          list.length &&
          list.map((item, idx) => {
            return (
              <li key={`mod_3` + item.id} className={`${idx && (idx + 1) % 3 === 0 ? styles.noMar : styles.lis}`}>
                {// 图片
                  type === 'pic' ? (
                    <div>
                      <img src={item.appLogo} className={styles.imgs3} alt="" />
                      <Popover
                        content={
                          <div>
                            <div style={{ marginBottom: '16px' }}>
                              预览渠道：
                            <Select defaultValue="123" style={{ width: 190 }}>
                                {selectOps.map((val, i) => {
                                  return (
                                    <Option key={`modal_select` + i} value={val.value + ''}>
                                      {val.title}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </div>
                            <div className={styles.prevContent}>
                              预览链接：
                            <div className={styles.preview}>
                                <Paragraph copyable className={styles.addelli}>
                                  {item.appLogo}
                                </Paragraph>
                              </div>
                            </div>
                          </div>
                        }
                        title=""
                        trigger="click"
                      >
                        <span className={`${styles.openbtn} ${styles.tac}`}>预览</span>
                      </Popover>
                    </div>
                  ) : (
                      ''
                    )}
                {// 文本
                  type === 'text' ? (
                    <div className={styles.texts}>
                      <h4>文本标题文本标题文本标题文本标题</h4>
                      <Paragraph ellipsis={{ rows: 3 }}>
                        这是一段关于文本的详细描述这是一段关于文本的详细描述这是一段关于文本的详细描述这是一段关于文本的详细描述
                    </Paragraph>
                    </div>
                  ) : (
                      ''
                    )}
              </li>
            );
          });
        return option;
      } else {
        // 文章
        const option =
          arcList &&
          arcList.length &&
          arcList.map((item: any, idx: number) => {
            return (
              <li
                key={`mod_li` + item.id}
                className={`${idx && (idx + 1) % 3 === 0 ? styles.noMar : styles.lis}`}
                onClick={this.toggleChecked.bind(null, item)}
                style={{ height: '276px' }}
              >
                {type === 'arc' ? (
                  <div className={styles.arcs}>
                    <h4 style={{ padding: '0 16px' }}>文章标题文章标题文章标题文章标题</h4>
                    <img src={item.appLogo} className={styles.arcimgs} alt="" />
                    <div style={{ padding: '10px 16px 0' }}>
                      <Paragraph ellipsis={{ rows: 2 }}>
                        这是一段关于文章的详细描述这是一段关于文章的详细描述这是一段关于文章的详细描述这是一段关于文章的详细描述
                      </Paragraph>
                    </div>
                  </div>
                ) : (
                    ''
                  )}
                {// 视频
                  type === 'video' ? <video src={video1} className={styles.vids} controls /> : ''}
                <Popover
                  content={
                    <div>
                      <div style={{ marginBottom: '16px' }}>
                        预览渠道：
                        <Select defaultValue="123" style={{ width: 190 }}>
                          {selectOps.map((val, i) => {
                            return (
                              <Option key={`modal_select` + i} value={val.value + ''}>
                                {val.title}
                              </Option>
                            );
                          })}
                        </Select>
                      </div>
                      <div className={styles.prevContent}>
                        预览链接：
                        <div className={styles.preview}>
                          {/* <Paragraph copyable ellipsis className={styles.addelli}>{item.appLogo}</Paragraph> */}
                          <Paragraph copyable>This is a copyable text.</Paragraph>
                        </div>
                      </div>
                    </div>
                  }
                  title=""
                  trigger="click"
                >
                  <span className={`${styles.openbtn} ${styles.tac}`}>预览</span>
                </Popover>
              </li>
            );
          });
        return option;
      }
    };

    return (
      <Spin spinning={loading}>
        {currentStep === 0 ? (
          <div className={styles.modalheader}>
            <span className={styles.addbtn}>
              <PlusOutlined />
              &nbsp;添加
            </span>
            <div className={styles.modalform}>
              <Search placeholder="请输入名称" onSearch={onSearch} style={{ width: 160, borderRadius: '4px' }} />
            </div>
          </div>
        ) : (
            ''
          )}
        {currentStep === 2 ? (
          <div className={styles.modalheader}>
            <p className={styles.totalCount}>
              <span>总计：&nbsp;12</span> &nbsp;|&nbsp;
              <span>&nbsp;成功：&nbsp;9&nbsp;</span> &nbsp;|&nbsp;
              <Popover placement="bottomRight" content={<PopView />} title="" trigger="click">
                <span style={{ cursor: 'pointer' }}>&nbsp;失败：&nbsp;</span>
                <span className={styles.errorNum}>3</span>
              </Popover>
            </p>
          </div>
        ) : (
            ''
          )}
        <div className={styles.modalcontent}>
          {curPage === 1 ? '' : <LeftOutlined onClick={getPrevData} className={styles.prev} />}
          {curPage === maxPage ? '' : <RightOutlined onClick={getNextData} className={styles.next} />}
          <ul className={styles.dataList}>
            {// 第1步走这里
              currentStep === 0 ? getLiListOne() : ''}
            {// 第3步走这里
              currentStep === 2 ? getLiListThree() : ''}
          </ul>
        </div>
      </Spin>
    );
  }
}
