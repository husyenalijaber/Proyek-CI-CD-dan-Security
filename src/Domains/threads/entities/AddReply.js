class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, owner, commentId } = payload;

    this.content = content;
    this.owner = owner;
    this.commentId = commentId;
  }

  _verifyPayload({ content, owner, commentId }) {
    if (content === undefined || owner === undefined || commentId === undefined) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof commentId !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (content.trim().length === 0) {
      throw new Error('ADD_REPLY.EMPTY_CONTENT');
    }
  }
}

module.exports = AddReply;
