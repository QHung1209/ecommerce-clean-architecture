import { Language } from 'src/language/domain/entities/language.entity';
import { PaginatedResult } from 'src/shared/presentation/mappers/pagination.interface';

type PaginatedLanguageResult = {
  languages: Language[];
  total: number;
  totalPages: number;
  currentPage: number;
};

export class LanguageResponseMapper {
  static toResponse(language: Language) {
    return {
      id: language.getId(),
      name: language.getName(),
      code: language.getCode(),
    };
  }

  static toResponseList(languages: Language[]) {
    return languages.map((language) => this.toResponse(language));
  }

  static toPaginatedResponse(result: PaginatedResult<Language>) {
    return {
      data: this.toResponseList(result.data),
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    };
  }
}
