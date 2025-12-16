const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const useCasePayload = {
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
    });

    await deleteReplyUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyReplyOwner).toHaveBeenCalledWith(useCasePayload.replyId, useCasePayload.owner);
    expect(mockThreadRepository.deleteReply).toHaveBeenCalledWith(useCasePayload.replyId);
  });
});
