const AddComment = require('../../../Domains/threads/entities/AddComment');
const AddedComment = require('../../../Domains/threads/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'sebuah comment',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedComment = await addCommentUseCase.execute(useCasePayload);

    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));

    expect(mockThreadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.addComment).toHaveBeenCalledWith(new AddComment({
      content: useCasePayload.content,
      owner: useCasePayload.owner,
      threadId: useCasePayload.threadId,
    }));
  });
});
