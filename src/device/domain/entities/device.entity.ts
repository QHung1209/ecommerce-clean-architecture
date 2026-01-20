import { BaseEntity } from 'src/shared/domain/entities/entity';

export interface DeviceProps {
  userId: number;
  userAgent: string;
  ip: string;
  jti: string;
  lastActive: Date;
  isActive: boolean;
}

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

  update(data: DeviceProps): void {
    this.props = { ...this.props, ...data };
  }

  static create(props: DeviceProps, id?: number): Device {
    return new Device(props, id);
  }
}
