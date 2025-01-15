import { IdRegistry } from "./Registry";
export declare class UniqIdManager {
    protected registry: IdRegistry;
    gen(): number;
    constructor();
}
