import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateLanguageUseCase } from 'src/language/application/use-cases/create-language.use-case';
import { GetLanguageUseCase } from 'src/language/application/use-cases/get-language.use-case';
import { ListLanguagesUseCase } from 'src/language/application/use-cases/list-languages.use-case';
import { UpdateLanguageUseCase } from 'src/language/application/use-cases/update-language.use-case';
import { SharedQueryDto } from 'src/shared/presentation/dto/shared.dto';
import { CreateLanguageDto } from '../dto/create-language.dto';
import { Public } from 'src/auth/infrastructure/decorators/public.decorator';
import { LanguageResponseMapper } from '../mappers/language-response.mapper';
import { UpdateLanguageDto } from '../dto/update-language.dto';

@Controller('languages')
export class LanguageController {
  constructor(
    private readonly createLanguageUseCase: CreateLanguageUseCase,
    private readonly updateLanguageUseCase: UpdateLanguageUseCase,
    private readonly getLanguageUseCase: GetLanguageUseCase,
    private readonly listLanguagesUseCase: ListLanguagesUseCase,
  ) {}

  @Public()
  @Get(':id')
  async findById(@Param('id') id: number) {
    const language = await this.getLanguageUseCase.execute(id);
    return LanguageResponseMapper.toResponse(language);
  }

  @Public()
  @Get()
  async findAll(@Query() query: SharedQueryDto) {
    const languages = await this.listLanguagesUseCase.execute(query);
    return LanguageResponseMapper.toPaginatedResponse(languages);
  }

  @Post()
  async create(@Body() createLanguageDto: CreateLanguageDto) {
    const language =
      await this.createLanguageUseCase.execute(createLanguageDto);
    return LanguageResponseMapper.toResponse(language);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateLanguageDto: UpdateLanguageDto,
  ) {
    const language = await this.updateLanguageUseCase.execute(
      id,
      updateLanguageDto,
    );
    return LanguageResponseMapper.toResponse(language);
  }
}
