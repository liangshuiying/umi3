import engine from 'store/src/store-engine';
import localStorage from 'store/storages/localStorage';
import cookieStorage from 'store/storages/cookieStorage';
import defaultsPlugin from 'store/plugins/defaults';
import expirePlugin from 'store/plugins/expire';
import observePlugin from 'store/plugins/observe';
import { StoreMap, IStore } from './typing.d';

export class Storage<T = StoreMap> {
  private store: IStore<T>;
  constructor(namespace: string) {
    const storages = [localStorage, cookieStorage];
    const plugins = [defaultsPlugin, expirePlugin, observePlugin];
    this.store = engine.createStore(storages, plugins, namespace) as IStore<T>;
  }

  get<K extends keyof T, V extends T[K], D = undefined>(key: K, optionalDefaultValue?: D): V | D {
    return this.store.get(key as string, optionalDefaultValue);
  }
  set<K extends keyof T, V extends T[K]>(key: K, value: V, expireTime?: number): void {
    return this.store.set(key, value, expireTime);
  }
  remove(key: keyof T) {
    this.store.remove(key as string);
  }
  each(callback: (val: any, namespacedKey: string) => void) {
    this.store.each(callback);
  }
  clearAll() {
    this.store.clearAll();
  }
  hasNamespace(namespace: string): boolean {
    return this.store.hasNamespace(namespace);
  }
  createStore(plugins?: Function[], namespace?: string): StoreJsAPI {
    return this.store.createStore(plugins, namespace);
  }
  addPlugin(plugin: Function): void {
    this.store.addPlugin(plugin);
  }
  namespace(namespace: string): StoreJsAPI {
    return this.store.namespace(namespace);
  }
  observe<K extends keyof T, V extends T[K]>(key: K, cb: (newVal: V, oldVal: V) => void): number {
    return this.store.observe(key, cb);
  }
  unobserve(obsId: number): void {
    this.store.unobserve(obsId);
  }
}

const scrmStore = new Storage<StoreMap>('scrm');

export default scrmStore;
