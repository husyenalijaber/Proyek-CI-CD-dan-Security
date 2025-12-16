class DeleteCommentUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { commentId, owner, threadId } = useCasePayload;

    await this._threadRepository.verifyCommentOwner(commentId, owner);
    await this._threadRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
