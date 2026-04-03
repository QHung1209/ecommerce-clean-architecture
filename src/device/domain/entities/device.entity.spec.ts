import { Device } from './device.entity';

describe('Device Entity', () => {
  const getProps = () => ({
    userId: 1,
    userAgent: 'Mozilla/5.0',
    ip: '192.168.1.1',
    jti: 'some-jwt-id',
  });

  it('should create a Device entity with domain defaults for lastActive and isActive', () => {
    const props = getProps();
    const device = Device.create(props);

    expect(device.getIsActive()).toBe(true);
    expect(device.getLastActive().getTime() - Date.now()).toBeLessThan(200);
  });

  it('should activate, deactivate and updateOnLogin', () => {
    const device = Device.create(getProps());

    device.deactivate();
    expect(device.getIsActive()).toBe(false);

    const oldTime = new Date(Date.now() - 10000);
    device.update({ lastActive: oldTime, isActive: false });

    device.updateOnLogin({
      jti: 'new-jti',
      userAgent: 'Chrome',
      ip: '10.0.0.1',
    });

    expect(device.getJti()).toBe('new-jti');
    expect(device.getIsActive()).toBe(true);
    expect(device.getLastActive().getTime()).toBeGreaterThan(oldTime.getTime());
  });
});
