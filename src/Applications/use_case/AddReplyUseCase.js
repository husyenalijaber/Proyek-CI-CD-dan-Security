const AddReply = require('../../Domains/threads/entities/AddReply');
const AddedReply = require('../../Domains/threads/entities/AddedReply');

class AddReplyUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { content, owner, commentId } = useCasePayload;

    await this._threadRepository.verifyCommentExists(commentId);

    const addReply = new AddReply({ content, owner, commentId });

    const addedReply = await this._threadRepository.addReply(addReply);

    return new AddedReply({
      id: addedReply.id,
      content: addedReply.content,
      owner: addedReply.owner,
    });
  }
}

module.exports = AddReplyUseCase;
