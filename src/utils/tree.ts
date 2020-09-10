import { destruct } from '@aximario/json-tree';

interface TreeNode {
  children?: TreeNode[];
  [propName: string]: any;
}

type TreeNodeByLevel = TreeNode & { level: number };

export interface OptionsType {
  key: string;
  [propName: string]: string;
}

export interface EnhanceTreeDataReturnType {
  converNodes: TreeNodeByLevel[];
  maxLevel: number;
  lastLevelValues: TreeNodeByLevel[];
  getLevelByKey(key: string | number): number;
  getChildrenByLevel(key: string | number): TreeNodeByLevel[];
  getOptionByLevel(arg0: TreeNodeByLevel[], level: number): TreeNodeByLevel[];
}

/**
 * 给tree每个节点加上level属性
 * @param nodes 数组
 * @param n  起始节点level
 */
const TreeDataAddLevel = (nodes: TreeNode[], n = 0): TreeNodeByLevel[] => {
  let converNodes = JSON.parse(JSON.stringify(nodes));

  function a(nodes) {
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].level = n;

      if (nodes[i].children) {
        n++;
        a(nodes[i].children);
        n--;
      }
    }
  }

  a(converNodes);

  return converNodes;
};

/**
 * 通过key找到对应的子级数据
 * @param treeData 数据源
 * @param key 需要查找的key值
 * @param keyName key索引名
 */
const getChildrenByKey = (treeData: TreeNodeByLevel[], key: string | number, keyName: string): TreeNodeByLevel[] => {
  let childList = [];

  function a(optionsData) {
    for (let i = 0; i < optionsData.length; i++) {
      if (optionsData[i][keyName] === key) {
        childList = Array.isArray(optionsData[i].children) ? optionsData[i].children : [];
        break;
      } else {
        if (!Array.isArray(optionsData[i].children)) return;
        a(optionsData[i].children);
      }
    }
  }

  a(treeData);

  return childList;
};

/**
 * 格式化tree数据
 * @param nodes 树节点数据源
 * @param options 参数配置
 */
export const EnhanceTreeData = (nodes: TreeNode[], options: OptionsType = { key: 'id' }): EnhanceTreeDataReturnType => {
  let distructNodes: TreeNodeByLevel[] = [];
  let maxLevel;
  let lastLevelValues: TreeNodeByLevel[] = [];

  const converNodes: TreeNodeByLevel[] = nodes.length ? TreeDataAddLevel(nodes) : [];

  distructNodes = converNodes.length
    ? destruct(converNodes, { id: options.key }).sort((a, b) => b.level - a.level)
    : [];
  maxLevel = distructNodes.length ? distructNodes[0].level : 0;
  lastLevelValues = distructNodes.filter(item => {
    return item.level === maxLevel;
  });

  function getOptionByLevel(prevLevelDatas: TreeNodeByLevel[], level: number): TreeNodeByLevel[] {
    return distructNodes.filter(item => {
      return item.level === level && prevLevelDatas.findIndex(prevItem => prevItem[options.key] === item.pid) >= 0;
    });
  }

  function getLevelByKey(key: string | number): number {
    return (distructNodes.find((item: TreeNodeByLevel) => item[options.key] === key) as TreeNodeByLevel).level;
  }

  function getChildren(key: string | number): TreeNodeByLevel[] {
    return getChildrenByKey(converNodes, key, options.key);
  }

  return {
    converNodes, // 给每个节点加了level属性数据
    maxLevel, // 层级数
    lastLevelValues, // 最后一级的数据集合
    getLevelByKey, // 通过key查找level
    getChildrenByLevel: getChildren,
    getOptionByLevel,
  };
};
