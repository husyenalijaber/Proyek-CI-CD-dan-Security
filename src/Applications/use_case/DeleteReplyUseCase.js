class DeleteReplyUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { replyId, owner } = useCasePayload;

    await this._threadRepository.verifyReplyOwner(replyId, owner);
    await this._threadRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
