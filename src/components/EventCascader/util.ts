export function arrayTreeFilter<T>(
  data: T[],
  filterFn: (item: T, level: number) => boolean,
  options?: {
    childrenKeyName?: string;
  },
) {
  options = options || {};
  options.childrenKeyName = options.childrenKeyName || 'children';
  let children = data || [];
  let result: T[] = [];
  let level = 0;
  do {
    // eslint-disable-next-line no-loop-func
    let foundItem: T = children.filter(function(item) {
      return filterFn(item, level);
    })[0];
    if (!foundItem) {
      break;
    }
    result.push(foundItem);
    children = (foundItem as any)[options.childrenKeyName] || [];
    level += 1;
  } while (children.length > 0);
  return result;
}

export function isEqualArrays(arrA: any[] | undefined, arrB: any[] | undefined): boolean {
  if (arrA === arrB) {
    return true;
  }

  if (!arrA || !arrB) {
    return false;
  }

  const len = arrA.length;

  if (arrB.length !== len) {
    return false;
  }

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < len; i++) {
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }

  return true;
}
