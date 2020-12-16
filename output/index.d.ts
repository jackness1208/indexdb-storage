/** IndexDBStorage - option */
export interface IndexDBStorageOption {
    /** 数据库名称 */
    name?: string;
    /** 数据库版本 */
    version?: number;
    /** logger */
    logger?: (type: LogType, args: any[]) => void;
}
export declare enum LogType {
    Success = "success",
    Warn = "warn",
    Error = "error",
    Info = "info"
}
/** IndexDBStorage - 属性 */
export declare type IndexDBStorageProperty = Required<IndexDBStorageOption>;
/** IndexDBStorage - 主体 */
export declare class IndexDBStorage {
    name: IndexDBStorageProperty['name'];
    storeName: string;
    version: IndexDBStorageProperty['version'];
    isSupported: boolean;
    private logger;
    constructor(option?: IndexDBStorageOption);
    private log;
    /** 清除 db */
    clear(): void;
    /** 打开db */
    open(): Promise<IDBDatabase | undefined>;
    /** 设置 */
    setItem<V = any>(name: string, value: V): Promise<string | undefined>;
    /** 获取 */
    getItem<V = any>(name: string): Promise<V | undefined>;
}
