export interface IRegistry {
}
export declare class Registry implements IRegistry {
}
export declare function getServerBaseUrl(mode?: boolean): string;
export declare function loggerCreator(isOn: boolean, titleValue?: string): (data: string) => void;
