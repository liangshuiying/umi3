import { Consumer } from './cascader-context';
import { IConfig } from './typing';
import React, { Component } from 'react';
import { CloseOutlined, DownOutlined } from '@ant-design/icons';
import classnames from 'classnames';

interface IProps {
  config: IConfig | { key: string; name: string };
}

class InputBox extends Component<IProps> {
  inputDom: any = null;
  textDom: any = null;
  textW = 4;

  clickInputBox = () => {
    this.inputDom.focus();
  };

  componentDidUpdate() {
    this.textW = this.textDom.offsetWidth + 10;
  }

  render() {
    const { config } = this.props;

    return (
      <Consumer>
        {({ selected, removeItem, inputFocused, searchText, setSearchText }) => (
          <div
            className={classnames('mlv_cascader_inputbox', { select_focused: inputFocused, pl: selected.length === 0 })}
            onClick={this.clickInputBox}
          >
            {selected.map((item, index) => (
              <span key={index} className="selected_item">
                {item[config.name]}
                <CloseOutlined className="ico_close" onClick={() => removeItem(item[config.key])} />
              </span>
            ))}
            <span ref={dom => (this.textDom = dom)} className="virval_text">
              {searchText}
            </span>
            {!selected.length && !searchText && <span className="input_placeholder">请选择</span>}
            <input
              ref={dom => (this.inputDom = dom)}
              type="text"
              style={{ width: this.textW }}
              value={searchText}
              onInput={(e: any) => setSearchText(e.target.value)}
              onChange={e => setSearchText(e.target.value)}
            />
            {/* <DownOutlined className="cascader_arrow" /> */}
          </div>
        )}
      </Consumer>
    );
  }
}

export default InputBox;
