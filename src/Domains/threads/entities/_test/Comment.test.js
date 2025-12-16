const Comment = require('../Comment');

describe('a Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'sebuah comment',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 'sebuah comment',
      owner: 'user-123',
      threadId: 'thread-123',
      date: '2021-08-08T07:22:33.555Z',
    };

    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
      threadId: 'thread-123',
      date: new Date(),
    };

    const { id, content, owner, threadId, date } = new Comment(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(threadId).toEqual(payload.threadId);
    expect(date).toEqual(payload.date);
  });
});
