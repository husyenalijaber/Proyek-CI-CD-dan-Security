const AddReply = require('../AddReply');

describe('an AddReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'sebuah reply',
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 123,
      owner: 'user-123',
      commentId: 'comment-123',
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when content is empty string', () => {
    const payload = {
      content: '',
      owner: 'user-123',
      commentId: 'comment-123',
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.EMPTY_CONTENT');
  });

  it('should create AddReply object correctly', () => {
    const payload = {
      content: 'sebuah reply',
      owner: 'user-123',
      commentId: 'comment-123',
    };

    const { content, owner, commentId } = new AddReply(payload);

    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(commentId).toEqual(payload.commentId);
  });
});
