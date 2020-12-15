/** IndexDBStorage - option */
export interface IndexDBStorageOption {
  /** 数据库名称 */
  name?: string
  /** 数据库版本 */
  version?: number
  /** logger */
  logger?: (type: LogType, args: any[]) => void
}
export enum LogType {
  Success = 'success',
  Warn = 'warn',
  Error = 'error',
  Info = 'info'
}
/** IndexDBStorage - 属性 */
export type IndexDBStorageProperty = Required<IndexDBStorageOption>

/** IndexDBStorage - 主体 */
export class IndexDBStorage {
  public name: IndexDBStorageProperty['name'] = 'default_db'
  public storeName: string = 'default_db_store'
  public version: IndexDBStorageProperty['version'] = 1
  public isSupported: boolean = !!window?.indexedDB
  private logger: IndexDBStorageProperty['logger'] = () => {}
  constructor(option?: IndexDBStorageOption) {
    if (option?.name) {
      this.name = option.name
      this.storeName = `${this.name}Store`
    }
    if (option?.version) {
      this.version = option.version
    }
    if (option?.logger) {
      this.logger = option.logger
    }
  }

  private log(type: LogType, args: any[]) {
    this.logger(type, ['[DBS]'].concat(args))
  }

  /** 清除 db */
  public clear() {
    const { isSupported, name } = this
    if (isSupported) {
      window.indexedDB.deleteDatabase(name)
    }
  }

  /** 打开db */
  public async open(): Promise<IDBDatabase> {
    const res = window.indexedDB.open(this.name, this.version)
    return await new Promise((resolve) => {
      res.onsuccess = () => {
        resolve(res.result)
      }
      res.onerror = (er) => {
        this.log(LogType.Warn, ['indexDB 初始化失败', er])
        resolve()
      }
      res.onupgradeneeded = () => {
        const db = res.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'name' })
        }
      }
    })
  }

  /** 设置 */
  public async setItem<V = any>(name: string, value: V) {
    const { storeName, log, isSupported, open } = this
    if (!isSupported) {
      return
    }
    const db = await open()

    if (db) {
      return await new Promise((resolve) => {
        const transaction = db.transaction(storeName, 'readwrite')
        const store = transaction.objectStore(storeName)
        const res = store.get(name)
        let storeRes
        res.onsuccess = () => {
          if (res.result === undefined) {
            storeRes = store.add({
              name,
              value
            })
          } else {
            storeRes = store.put({
              name,
              value
            })
          }
          storeRes.onsuccess = () => {
            log(LogType.Success, [`存入成功 name: ${name} value: `, value])
            resolve()
          }
          storeRes.onerror = (er) => {
            log(LogType.Warn, [`存入失败 name: ${name} value: `, value, 'error:', er])
          }
        }
        res.onerror = (er) => {
          log(LogType.Warn, [`存入失败 name: ${name} value: `, value, 'error:', er])
        }
      })
    }
  }

  /** 获取 */
  public async getItem<V = any>(name: string): Promise<V | undefined> {
    const { log, storeName, open, isSupported } = this
    if (!isSupported) {
      return
    }

    const db = await open()
    if (db) {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const res = store.get(name)
      return new Promise((resolve) => {
        res.onsuccess = () => {
          resolve(res.result)
        }
        res.onerror = (er) => {
          log(LogType.Warn, [`读取失败 name: ${name} error:`, er])
          resolve()
        }
      })
    }
  }
}
