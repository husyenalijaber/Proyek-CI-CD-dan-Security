class GettedReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, date, content, is_delete } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
    this.isDelete = is_delete;
  }

  _verifyPayload({ id, username, date, content, is_delete }) {
    if (!id || !username || !date || content === undefined || is_delete === undefined) {
      throw new Error('GETTED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string' || typeof is_delete !== 'boolean') {
      throw new Error('GETTED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GettedReply;

