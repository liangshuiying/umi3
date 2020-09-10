import ReactDOM from 'react-dom';

export interface NewEventPortalProps {
  container?: HTMLElement;
}

const NewEventPortal: React.FC<NewEventPortalProps> = props => {
  if (props.container === null || props.container === void 0) {
    return null;
  }
  return ReactDOM.createPortal(props.children, props.container);
};

export default NewEventPortal;
