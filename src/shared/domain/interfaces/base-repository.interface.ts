import { SharedQueryInterface } from './query.interface';

export interface BaseRepositoryInterface<T, ID = number> {
  findById(id: ID): Promise<T | null>;
  findAll(query: SharedQueryInterface): Promise<T[]>;
  delete(id: ID): Promise<void>;
}
