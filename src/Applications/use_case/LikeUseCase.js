class LikeUseCase {
    constructor({ likeRepository, threadRepository }) {
        this._likeRepository = likeRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const { threadId, commentId, credentialId } = useCasePayload;

        await this._threadRepository.verifyThreadExists(threadId);
        await this._threadRepository.verifyCommentExists(commentId);

        const isLiked = await this._likeRepository.checkLikeIsExists(credentialId, commentId);

        if (isLiked) {
            await this._likeRepository.deleteLike(credentialId, commentId);
        } else {
            await this._likeRepository.addLike(credentialId, commentId);
        }
    }
}

module.exports = LikeUseCase;
