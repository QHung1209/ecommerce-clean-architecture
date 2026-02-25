export type PaginatedResult<T> = {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
};
