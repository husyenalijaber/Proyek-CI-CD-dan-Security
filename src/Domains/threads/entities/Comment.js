class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, owner, threadId, date } = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
    this.threadId = threadId;
    this.date = date;
  }

  _verifyPayload({ id, content, owner, threadId, date }) {
    if (!id || !content || !owner || !threadId || !date) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string' || typeof threadId !== 'string' || !(date instanceof Date)) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
