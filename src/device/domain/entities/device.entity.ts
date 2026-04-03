import { BaseEntity } from 'src/shared/domain/entities/entity';

export type DeviceProps = {
  userId: number;
  userAgent: string;
  ip: string;
  jti: string;
  lastActive: Date;
  isActive: boolean;
};

export class Device extends BaseEntity<DeviceProps> {
  constructor(props: DeviceProps, id?: number) {
    super(props, id);
  }

  getUserId(): number {
    return this.props.userId;
  }

  getUserAgent(): string {
    return this.props.userAgent;
  }

  getIp(): string {
    return this.props.ip;
  }

  getLastActive(): Date {
    return this.props.lastActive;
  }

  getIsActive(): boolean {
    return this.props.isActive;
  }

  getJti(): string {
    return this.props.jti;
  }

  activate(): void {
    this.props.isActive = true;
  }

  deactivate(): void {
    this.props.isActive = false;
  }

  /**
   * Domain method: update device on login — refreshes lastActive and jti.
   */
  updateOnLogin(data: { jti: string; userAgent: string; ip: string }): void {
    this.props.jti = data.jti;
    this.props.userAgent = data.userAgent;
    this.props.ip = data.ip;
    this.props.lastActive = new Date();
    this.props.isActive = true;
  }

  update(data: Partial<DeviceProps>): void {
    this.props = { ...this.props, ...data };
  }

  /**
   * Factory method with domain defaults: lastActive = now, isActive = true.
   */
  static create(
    props: Omit<DeviceProps, 'lastActive' | 'isActive'>,
    id?: number,
  ): Device {
    return new Device(
      {
        ...props,
        lastActive: new Date(),
        isActive: true,
      },
      id,
    );
  }

  /**
   * Reconstitute from persistence (all props provided).
   */
  static reconstitute(props: DeviceProps, id: number): Device {
    return new Device(props, id);
  }
}
