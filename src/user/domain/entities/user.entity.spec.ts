import { User, UserStatus } from './user.entity';
import { Email } from 'src/shared/domain/value-objects/email.vo';

describe('User Entity', () => {
  const getValidProps = () => ({
    name: 'John Doe',
    email: Email.create('john@example.com'),
    password: 'HashedPassword123!',
    phoneNumber: '123456789',
    avatar: 'avatar.png',
    status: UserStatus.ACTIVE,
    roleId: 2,
    tokenVersion: 1,
  });

  describe('creation and getters', () => {
    it('should create a User entity successfully', () => {
      const props = getValidProps();
      const user = User.create(props);

      expect(user).toBeInstanceOf(User);
      expect(user.getName()).toBe(props.name);
      expect(user.getEmail()).toBe(props.email);
    });
  });

  describe('domain behaviors', () => {
    it('should activate user', () => {
      // instantiate with INACTIVE directly via constructor to avoid create() hardcoded ACTIVE
      const user = new User({
        ...(getValidProps() as any),
        status: UserStatus.INACTIVE,
      });
      user.activate();
      expect(user.getStatus()).toBe(UserStatus.ACTIVE);
    });

    it('should deactivate user', () => {
      const user = User.create(getValidProps());
      user.deactivate();
      expect(user.getStatus()).toBe(UserStatus.INACTIVE);
    });

    it('should increment token version', () => {
      const user = User.create(getValidProps());
      user.incrementTokenVersion();
      expect(user.getTokenVersion()).toBe(2);
    });

    it('should detach role', () => {
      const user = User.create(getValidProps());
      user.detachRole();
      expect(user.getRoleId()).toBeNull();
    });

    it('should update props selectively', () => {
      const user = User.create(getValidProps());
      user.updateProfile({
        name: 'Jane Doe',
        email: user.getEmail(),
        phoneNumber: user.getPhoneNumber(),
        avatar: user.getAvatar() || '',
        roleId: user.getRoleId(),
      });
      expect(user.getName()).toBe('Jane Doe');
      expect(user.getEmail().getValue()).toBe(getValidProps().email.getValue()); // unchanged
    });
  });
});
