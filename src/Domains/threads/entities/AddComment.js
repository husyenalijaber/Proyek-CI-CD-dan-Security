class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, owner, threadId } = payload;

    this.content = content;
    this.owner = owner;
    this.threadId = threadId;
  }

  _verifyPayload(payload) {
    const { content, owner, threadId } = payload;
    
    if (content === undefined || owner === undefined || threadId === undefined) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof threadId !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (content.trim().length === 0) {
      throw new Error('ADD_COMMENT.EMPTY_CONTENT');
    }
  }
}

module.exports = AddComment;
