import { BaseEntity } from 'src/shared/domain/entities/entity';
import { Email } from 'src/shared/domain/value-objects/email.vo';
import { Password } from 'src/shared/domain/value-objects/password.vo';

export enum UserStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
}

export type UserProps = {
  email: Email;
  name: string;
  password: string;
  phoneNumber: string;
  avatar?: string;
  status: UserStatus;
  roleId: number | null;
  tokenVersion: number;
};

export class User extends BaseEntity<UserProps> {
  constructor(props: UserProps, id?: number) {
    super(props, id);
  }
  // Getters
  getEmail(): Email {
    return this.props.email;
  }

  getName(): string {
    return this.props.name;
  }

  getPassword(): string {
    return this.props.password;
  }

  getPhoneNumber(): string {
    return this.props.phoneNumber;
  }

  getAvatar(): string | undefined {
    return this.props.avatar;
  }

  getStatus(): UserStatus {
    return this.props.status;
  }

  getRoleId(): number | null {
    return this.props.roleId;
  }

  getTokenVersion(): number {
    return this.props.tokenVersion;
  }

  setEmail(email: Email): void {
    this.props.email = email;
  }

  setName(name: string): void {
    this.props.name = name;
  }

  setPassword(password: string): void {
    this.props.password = password;
  }

  setPhoneNumber(phoneNumber: string): void {
    this.props.phoneNumber = phoneNumber;
  }

  setTokenVersion(tokenVersion: number): void {
    this.props.tokenVersion = tokenVersion;
  }

  setAvatar(avatar: string): void {
    this.props.avatar = avatar;
  }

  setRoleId(roleId: number | null): void {
    this.props.roleId = roleId;
  }

  // Domain methods
  activate(): void {
    if (this.props.status === UserStatus.ACTIVE) {
      throw new Error('User is already active');
    }
    this.props.status = UserStatus.ACTIVE;
  }

  deactivate(): void {
    if (this.props.status === UserStatus.INACTIVE) {
      throw new Error('User is already inactive');
    }
    this.props.status = UserStatus.INACTIVE;
  }

  isActive(): boolean {
    return this.props.status === UserStatus.ACTIVE;
  }

  // Get all props (useful for persistence)
  getProps(): UserProps {
    return { ...this.props };
  }

  updateProfile(data: {
    name: string;
    email: Email;
    phoneNumber: string;
    avatar: string;
    roleId: number | null;
  }): void {
    this.props.name = data.name;
    this.props.email = data.email;
    this.props.phoneNumber = data.phoneNumber;
    this.props.avatar = data.avatar;
    this.props.roleId = data.roleId;
  }

  static create(props: Omit<UserProps, 'status'>, id?: number): User {
    return new User({ ...props, status: UserStatus.ACTIVE }, id);
  }

  static register(props: {
    email: Email;
    password: string;
    name: string;
  }): User {
    return new User({
      email: props.email,
      password: props.password,
      name: props.name,
      phoneNumber: '',
      avatar: '',
      status: UserStatus.ACTIVE,
      roleId: 1,
      tokenVersion: 0,
    });
  }
}
