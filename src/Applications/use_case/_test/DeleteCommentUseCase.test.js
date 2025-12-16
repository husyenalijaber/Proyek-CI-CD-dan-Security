const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      commentId: 'comment-123',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyCommentOwner).toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockThreadRepository.deleteComment).toHaveBeenCalledWith(useCasePayload.commentId);
  });
});
