export enum UserStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
}

export interface UserProps {
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
  avatar?: string;
  totpSecret?: string;
  status: UserStatus;
  roleId: number;
}

export class User {
  constructor(
    public readonly id: number,
    private props: UserProps,
  ) {}

  // Getters
  getEmail(): string {
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

  getTotpSecret(): string | undefined {
    return this.props.totpSecret;
  }

  getStatus(): UserStatus {
    return this.props.status;
  }

  getRoleId(): number {
    return this.props.roleId;
  }

  // Setters for mutable properties
  setEmail(email: string): void {
    // TODO: Add email validation
    this.props.email = email;
  }

  setName(name: string): void {
    this.props.name = name;
  }

  setPassword(password: string): void {
    // Note: Should be hashed before setting
    this.props.password = password;
  }

  setPhoneNumber(phoneNumber: string): void {
    this.props.phoneNumber = phoneNumber;
  }

  setAvatar(avatar: string): void {
    this.props.avatar = avatar;
  }

  setTotpSecret(totpSecret: string): void {
    this.props.totpSecret = totpSecret;
  }

  setRoleId(roleId: number): void {
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

  // Static factory method for creating new users
  static create(props: Omit<UserProps, 'status'>): User {
    return new User(0, {
      ...props,
      status: UserStatus.INACTIVE,
    });
  }

  // Get all props (useful for persistence)
  getProps(): UserProps {
    return { ...this.props };
  }
}
