import { millenniumRepresentation } from '../../utils/utils';
import noneImg from '../../assets/home/default_home_nodata.svg';
import styles from './style.less';
import { HomeType } from './model';
import { Link } from 'dva/router';
import React, { Component } from 'react';

interface HomePageProps extends HomeType {
  //getCounts: Function;
}
interface HomePageStates {
  modelFlag: boolean;
}

class Home extends Component<HomePageProps,HomePageStates> {
  state = {
    modelFlag: false,
  };
  public componentDidMount() {
    this.props.getCounts();
  }

  public render() {
    const counts = this.props.counts;
    return (
      <div className={styles.page_home}>
        <section className="area1">
          <div className="item">
            <div className="item_wrap">
              <div className="item_tit">
                <i className="icon_home_top1"></i>会员总数
              </div>
              <div className="item_num nums">{millenniumRepresentation(counts[0].total_count)}</div>
              <div className="item_variation">{/* 日均新增人数<span>{counts[0].daily_average_increment}</span> */}</div>
            </div>
          </div>
          <div className="item">
            <div className="item_wrap">
              <div className="item_tit">
                <i className="icon_home_top2"></i>今日新增会员
              </div>
              <div className="item_num nums">{millenniumRepresentation(counts[1].increment)}</div>
              <div className="item_variation">
                {counts[1].status !== 'unknown' ? '相比昨日' : <span style={{ opacity: 0 }}>-</span>}
                {counts[1].status === 'equal' && <span>-</span>}
                {(counts[1].status === 'up' || counts[1].status === 'down') && (
                  <span>
                    <i className={`icon_${counts[1].status}`}></i>
                    {counts[1].rate || '0'}%
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="item">
            <div className="item_wrap">
              <div className="item_tit">
                <i className="icon_home_top3"></i>本周新增会员
              </div>
              <div className="item_num nums">{millenniumRepresentation(counts[2].increment)}</div>
              <div className="item_variation">
                {counts[2].status !== 'unknown' ? '相比上周' : <span style={{ opacity: 0 }}>-</span>}
                {counts[2].status === 'equal' && <span>-</span>}
                {(counts[2].status === 'up' || counts[2].status === 'down') && (
                  <span>
                    <i className={`icon_${counts[2].status}`}></i>
                    {counts[2].rate || '0'}%
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="item">
            <div className="item_wrap">
              <div className="item_tit">
                <i className="icon_home_top4"></i>本月新增会员
              </div>
              <div className="item_num nums">{millenniumRepresentation(counts[3].increment)}</div>
              <div className="item_variation">
                {counts[3].status !== 'unknown' ? '相比上月' : <span style={{ opacity: 0 }}>-</span>}
                {counts[3].status === 'equal' && <span>-</span>}
                {(counts[3].status === 'up' || counts[3].status === 'down') && (
                  <span>
                    <i className={`icon_${counts[3].status}`}></i>
                    {counts[3].rate || '0'}%
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="item">
            <div className="item_wrap">
              <div className="item_tit">
                <i className="icon_home_top5"></i>本年新增会员
              </div>
              <div className="item_num nums">{millenniumRepresentation(counts[4].increment)}</div>
              <div className="item_variation">
                {counts[4].status !== 'unknown' ? '相比去年' : <span style={{ opacity: 0 }}>-</span>}
                {counts[4].status === 'equal' && <span>-</span>}
                {(counts[4].status === 'up' || counts[4].status === 'down') && (
                  <span>
                    <i className={`icon_${counts[4].status}`}></i>
                    {counts[4].rate || '0'}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="area3">
          <div className="area_tit">数据分析</div>
          <div
            className="area_content paddingTop0"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 254,
            }}
          >
            <img src={noneImg} style={{ marginBottom: 10, width: 28, height: 28 }} />
            <p>暂无统计数据</p>
          </div>
        </section>
        <section className="area3">
          <div className="area_tit">常用功能</div>
          <div className="area_content">
            <Link to="/bases/domain/superior" className="item">
              <i className="icon_bottom_1"></i>
              <p>绑定上级域</p>
            </Link>
            <Link to="/bases/domain/inferior" className="item">
              <i className="icon_bottom_2"></i>
              <p>子域管理</p>
            </Link>
            <Link to="/members/manage/page" className="item">
              <i className="icon_bottom_3"></i>
              <p>查询会员</p>
            </Link>
            <Link to="/bases/authority/operator" className="item">
              <i className="icon_bottom_4"></i>
              <p>操作员管理</p>
            </Link>
          </div>
        </section>
      </div>
    );
  }
}

export default Home;
