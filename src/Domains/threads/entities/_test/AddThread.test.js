const AddThread = require('../AddThread');

describe('an AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'sebuah thread',
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: 123,
      body: 'sebuah body thread',
      owner: 'user-123',
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title length more than 50 character', () => {
    const payload = {
      title: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
      body: 'sebuah body thread',
      owner: 'user-123',
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should throw error when title or body is empty string', () => {
    const payload = {
      title: '',
      body: 'sebuah body thread',
      owner: 'user-123',
    };

    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.EMPTY_TITLE_OR_BODY');
  });

  it('should create AddThread object correctly', () => {
    const payload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
    };

    const { title, body, owner } = new AddThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
