// 用法

// import NewSearch from '@/components/NewSearch';

// <NewSearch items={this.getSearchItem()} handleSearch={this.handleSubmit} handleReset={this.handleReset}/>

// getSearchItem() {
//   let flagList = [
//     { title: '是否黑名单', value: '' },
//     { title: '是', value: '1' },
//     { title: '否', value: '0' },
//   ];

//   let config = {
//     formItems: [
//       {
//         name: 'create_date',
//         RangePicker: {
//           showTime: true,
//           format: "YYYY-MM-DD HH:mm:ss",
//           placeholder: ['开始时间', '结束时间']
//         }
//       },
//       {
//         name: 'login_method_id',
//         width: 150,
//         select: {
//           optionValue: flagList,
//         },
//       },
//       {
//         name: 'like_id',
//         input: { placeholder: '第三方ID/openID' },
//       },
//     ],
//     initValue: {
//       login_method_id: '',
//     },
//   };

//   return config;
// }