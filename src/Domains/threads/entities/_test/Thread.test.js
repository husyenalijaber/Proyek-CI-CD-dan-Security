const Thread = require('../Thread');

describe('a Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
    };

    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
      date: '2021-08-08T07:19:09.775Z',
    };

    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Thread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
      date: new Date(),
    };

    const { id, title, body, owner, date } = new Thread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
    expect(date).toEqual(payload.date);
  });
});
