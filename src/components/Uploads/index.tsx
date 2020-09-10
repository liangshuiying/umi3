import { UploadFile } from 'antd/lib/upload/interface';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import React from 'react';

const { Dragger } = Upload;
export interface UploadPicType extends UploadFile {
}
interface UploadsProps {
  type?: 'pic' | 'video';
  max: number;
}

interface UploadsState {
  fileList: UploadPicType[];
  isok: boolean;
}

export default class Uploads extends React.Component<UploadsProps, UploadsState> {
  curNum = 0;
  state = {
    fileList: [],
    isok: true, // beforeUpload校验通过
  };


  beforeUpload = (file) => {
    const { type = "pic", max } = this.props;
    const { fileList } = this.state;
    this.curNum++;
    let hasFileLength = fileList.length;
    let res;
    const isMaxed = this.curNum <= max;
    if (!isMaxed) {
      message.error(`一次最多能上传${max}张${type === 'pic' ? '图片' : '视频'}`);
      this.curNum = hasFileLength;
    }

    if (type === 'pic') { // 格式及大小判断
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/jpg'
        || file.type === 'image/png' || file.type === 'image/bmp' || file.type === 'image/gif';
      if (!isJpgOrPng) {
        message.error('只能上传jpeg、jpg、png、bmp、gif格式的图片');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片需小于2M!');
      }
      res = isMaxed && isJpgOrPng && isLt2M;
    } else {
      const isJpgOrPng = file.type === 'video/mp4';
      if (!isJpgOrPng) {
        message.error('只能上传MP4格式的视频');
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        message.error('图片需小于2M!');
      }
      res = isMaxed && isJpgOrPng && isLt2M;
    }

    this.setState({
      isok: res
    }, () => {
      return res;
    });
  };


  render() {
    const { fileList, isok } = this.state;
    const { type = "pic" } = this.props;

    const dragprops = {
      name: 'file',
      multiple: true,
      fileList,
      beforeUpload: this.beforeUpload,
      action: '/admin/v1/domain/member/portrait',
      onChange: ({ fileList }) => {
        if (fileList && fileList[0] && fileList[0].response && fileList[0].response.status !== 1) {
          message.error('图片上传失败');
          this.curNum--;
        } else {
          isok && this.setState({ fileList });
        }
      }
    };

    const texts = {
      pic: '上传图片支持bmp、png、jpeg、jpg、gif几种格式、单张图片不超过2M',
      video: '上传视频支持mp4格式、单个视频不超过10M'
    };
    return (
      <div>
        <Dragger {...dragprops}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或将{type === 'pic' ? '图片' : '视频'}拖拽到这里上传</p>
          <p className="ant-upload-hint">
            支持{texts[type]}
          </p>
        </Dragger>
      </div >
    );
  }
}