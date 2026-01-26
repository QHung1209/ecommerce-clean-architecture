export class VerificationCodeCreatedEvent {
  constructor(
    public readonly email: string,
    public readonly code: string,
    public readonly type: string,
  ) {}
}
