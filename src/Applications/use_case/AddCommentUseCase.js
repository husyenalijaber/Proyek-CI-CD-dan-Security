const AddComment = require('../../Domains/threads/entities/AddComment');
const AddedComment = require('../../Domains/threads/entities/AddedComment');

class AddCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { content, owner, threadId } = useCasePayload;

    await this._threadRepository.verifyThreadExists(threadId);

    const addComment = new AddComment({ content, owner, threadId });

    const addedComment = await this._threadRepository.addComment(addComment);

    return new AddedComment({
      id: addedComment.id,
      content: addedComment.content,
      owner: addedComment.owner,
    });
  }
}

module.exports = AddCommentUseCase;
