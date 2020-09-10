import React, { Component } from 'react';
import { Table } from 'antd';
import { TableProps, ColumnProps } from 'antd/lib/table';

export interface TableViewProps<T extends object> extends TableProps<T> {
  showSizeChanger: boolean;
  showQuickJumper: boolean;
  hideTotal?: boolean;
  onSelectRows?: (selectedRowKeys: string[] | number[], selectedRows: T[]) => void;
  getColumns: () => ColumnProps<T>[] | undefined;
  onChangePageOrPageSize: (pageSize: number, current: number) => void;
  itemRender?: (page: number, type: 'page' | 'prev' | 'next', originalElement: any) => React.ReactNode;
  total: number;
  rowSelection: any;
}

class TableView<T extends object = any> extends Component<TableViewProps<T>> {
  state = {
    selectedRowKeys: [],
    pageSize: 10,
    current: 1,
  };

  changePageSize = pageSize => {
    this.setState({ pageSize, current: 1 });
  };

  changePage = current => {
    this.setState({ current });
  };

  resetPageSize = () => {
    this.setState({ current: 1 });
  };

  clearDatas = () => {
    // 清除state中存储的选中数据
    this.setState({
      selectedRowKeys: [],
    });
  };

  render() {
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys });
        this.props.onSelectRows && this.props.onSelectRows(selectedRowKeys, selectedRows);
      },
    };

    const { pageSize, current } = this.state;
    const { dataSource, hideTotal } = this.props;
    const {
      showQuickJumper,
      showSizeChanger,
      onSelectRows,
      getColumns,
      onChangePageOrPageSize,
      total,
      itemRender,
      ...rest
    } = this.props;

    const paginationProps = {
      showSizeChanger: typeof showQuickJumper === 'undefined' ? true : showQuickJumper,
      showQuickJumper: typeof showQuickJumper === 'undefined' ? true : showQuickJumper,
      showTotal: !hideTotal ? () => `共${total}条记录  第${current}/${Math.ceil(total / pageSize)}页` : '',
      pageSize,
      current,
      total,
      itemRender,
      onShowSizeChange: (current, pageSize) => {
        this.changePageSize(pageSize);
        onChangePageOrPageSize(pageSize, current);
      },
      onChange: current => {
        this.changePage(current);
        onChangePageOrPageSize(pageSize, current);
      },
      size: 'small',
    };

    return (
      <Table
        className="tabList"
        pagination={paginationProps as any}
        dataSource={dataSource}
        {...rest}
        rowSelection={this.props.rowSelection === null ? this.props.rowSelection : rowSelection}
        columns={getColumns()}
        loading={this.props.loading}
      />
    );
  }
}

export default TableView;
