import SearchModal from './SearchModal';

export default SearchModal;


// 用法
// <SearchModal
//   visible={modelFlag}
//   type={'pic'}
//   total={10}
//   onCancel={this.closeModal}
//   handleSubmit={this.handleSubmit}
//   handleSearch={this.handleSearch}
//   selectOps={selectOps}
// />


// 参数说明
// visible：控制弹窗显示与否 true/false
// type: 弹窗类型  pic(图片)/vid（视频）/arc（文章）/text（文本）
// onCancel：取消按钮事件
// handleSubmit:step1中的下一步、step3中的确定事件
// handleSearch:step1中的搜索事件
// selectOps：预览渠道下拉列表数据
// total:可不填写，下次在接口中获取