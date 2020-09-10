import RenderAuthorize from '@/components/Authorized';

let Authorized = RenderAuthorize();

const reloadAuthorized = () => {
  Authorized = RenderAuthorize();
};

export { reloadAuthorized };
export default Authorized;
