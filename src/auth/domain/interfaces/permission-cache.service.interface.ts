import { HTTPMethod } from "@prisma/client";

export interface PermissionCacheServiceInterface {
    getPermissionsByUser(userId: number, roleId: number | null): Promise<{ path: string; method: HTTPMethod }[] | null>;
    cachePermissionsByUser(userId: number, roleId: number | null): Promise<void>;
}
