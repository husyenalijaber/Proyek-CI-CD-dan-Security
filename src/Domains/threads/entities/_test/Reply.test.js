const Reply = require('../Reply');

describe('a Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'sebuah reply',
      owner: 'user-123',
      commentId: 'comment-123',
    };

    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 'sebuah reply',
      owner: 'user-123',
      commentId: 'comment-123',
      date: '2021-08-08T07:59:48.766Z',
    };

    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Reply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'sebuah reply',
      owner: 'user-123',
      commentId: 'comment-123',
      date: new Date(),
    };

    const { id, content, owner, commentId, date } = new Reply(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(commentId).toEqual(payload.commentId);
    expect(date).toEqual(payload.date);
  });
});
