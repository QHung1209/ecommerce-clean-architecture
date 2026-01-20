export abstract class BaseEntity<Props> {
  protected readonly id?: number;
  protected props: Props;

  protected constructor(props: Props, id?: number) {
    this.props = props;
    this.id = id;
  }

  getProps(): Props {
    return this.props;
  }

  getId(): number | undefined {
    return this.id;
  }

  hasId(): boolean {
    return this.id !== undefined;
  }
}
