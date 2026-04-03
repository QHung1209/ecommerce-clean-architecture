import { Language } from './language.entity';

describe('Language Entity', () => {
  it('should create a Language entity successfully', () => {
    const props = { name: 'English', code: 'EN' };
    const language = Language.create(props);

    expect(language.getName()).toBe('English');
    expect(language.getCode()).toBe('EN');
  });

  it('should update a Language entity', () => {
    const language = Language.create({ name: 'English', code: 'EN' });
    language.update({ name: 'American English' });
    
    expect(language.getName()).toBe('American English');
    expect(language.getCode()).toBe('EN');
  });
});
