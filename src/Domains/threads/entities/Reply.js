class Reply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, owner, commentId, date } = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
    this.commentId = commentId;
    this.date = date;
  }

  _verifyPayload({ id, content, owner, commentId, date }) {
    if (!id || !content || !owner || !commentId || !date) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string' || typeof commentId !== 'string' || !(date instanceof Date)) {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Reply;
