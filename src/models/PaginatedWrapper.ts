
export interface PaginatedWrapper<T> {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    data: T[]
}