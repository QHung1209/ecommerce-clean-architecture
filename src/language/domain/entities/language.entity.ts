import { BaseEntity } from 'src/shared/domain/entities/entity';

type LanguageProps = {
  name: string;
  code: string;
};

export class Language extends BaseEntity<LanguageProps> {
  constructor(props: LanguageProps, id?: number) {
    super(props, id);
  }

  static create(props: LanguageProps, id?: number): Language {
    return new Language(props, id);
  }

  getName(): string {
    return this.props.name;
  }

  getCode(): string {
    return this.props.code;
  }

  setProps(props: LanguageProps): void {
    this.props = props;
  }

  setName(name: string): void {
    this.props.name = name;
  }

  setCode(code: string): void {
    this.props.code = code;
  }

  update(data: Partial<LanguageProps>): void {
    this.props = { ...this.props, ...data };
  }
}
