export function getBtns(allBtnsData: any, path: string) {
  let btns: any[] = [];
  if (!path || (!allBtnsData && allBtnsData.length === 0)) {
    return;
  }
  btns = getBtnsByPath(allBtnsData, path, btns);
  return btns;
}

function getBtnsByPath(allBtnsData: any, path: string, btns: any[]) {
  for (const item of allBtnsData) {
    let isHas = path.indexOf(item.path);
    if (item.path === path) {
      return (btns = item.routes);
    } else if (isHas !== -1) {
      return getBtnsByPath(item.routes, path, btns);
    }
  }
}

export function getBtnCode(btns: any[], code: string) {
  if (!btns || btns.length === 0 || !code) return false;
  let codes = btns.find((item: any) => {
    return item.code + "" === code;
  });
  if (codes) {
    return true;
  } else {
    return false;
  }
}
