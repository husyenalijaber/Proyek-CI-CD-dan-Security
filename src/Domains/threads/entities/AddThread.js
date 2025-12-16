class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body, owner } = payload;

    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const { title, body, owner } = payload;
    
    if (title === undefined || body === undefined || owner === undefined) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (title.length > 50) {
      throw new Error('ADD_THREAD.TITLE_LIMIT_CHAR');
    }

    if (title.trim().length === 0 || body.trim().length === 0) {
      throw new Error('ADD_THREAD.EMPTY_TITLE_OR_BODY');
    }
  }
}

module.exports = AddThread;
