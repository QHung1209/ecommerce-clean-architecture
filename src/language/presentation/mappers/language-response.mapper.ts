import { Language } from 'src/language/domain/entities/language.entity';

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

  static toPaginatedResponse(result: PaginatedLanguageResult) {
    return {
      languages: this.toResponseList(result.languages),
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
    };
  }
}
