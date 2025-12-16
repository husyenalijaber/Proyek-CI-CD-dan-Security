const LikeUseCase = require('../LikeUseCase');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('LikeUseCase', () => {
    it('should orchestrate the add like action correctly when like does not exist', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            credentialId: 'user-123',
        };

        const mockThreadRepository = new ThreadRepository();
        const mockLikeRepository = new LikeRepository();

        mockThreadRepository.verifyThreadExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.verifyCommentExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockLikeRepository.checkLikeIsExists = jest.fn()
            .mockImplementation(() => Promise.resolve(false));
        mockLikeRepository.addLike = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const likeUseCase = new LikeUseCase({
            likeRepository: mockLikeRepository,
            threadRepository: mockThreadRepository,
        });

        // Action
        await likeUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
        expect(mockThreadRepository.verifyCommentExists).toBeCalledWith('comment-123');
        expect(mockLikeRepository.checkLikeIsExists).toBeCalledWith('user-123', 'comment-123');
        expect(mockLikeRepository.addLike).toBeCalledWith('user-123', 'comment-123');
    });

    it('should orchestrate the delete like action correctly when like exists', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            credentialId: 'user-123',
        };

        const mockThreadRepository = new ThreadRepository();
        const mockLikeRepository = new LikeRepository();

        mockThreadRepository.verifyThreadExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.verifyCommentExists = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockLikeRepository.checkLikeIsExists = jest.fn()
            .mockImplementation(() => Promise.resolve(true));
        mockLikeRepository.deleteLike = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const likeUseCase = new LikeUseCase({
            likeRepository: mockLikeRepository,
            threadRepository: mockThreadRepository,
        });

        // Action
        await likeUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
        expect(mockThreadRepository.verifyCommentExists).toBeCalledWith('comment-123');
        expect(mockLikeRepository.checkLikeIsExists).toBeCalledWith('user-123', 'comment-123');
        expect(mockLikeRepository.deleteLike).toBeCalledWith('user-123', 'comment-123');
    });
});
