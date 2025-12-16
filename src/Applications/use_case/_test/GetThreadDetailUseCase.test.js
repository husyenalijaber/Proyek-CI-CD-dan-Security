const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    const mockThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        isDelete: false,
      },
    ];

    const mockReplies = [
      {
        id: 'reply-123',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'sebuah reply',
        isDelete: false,
      },
    ];

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockThreadRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockThreadRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReplies));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute('thread-123');

    expect(threadDetail).toStrictEqual({
      thread: {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
        comments: [
          {
            id: 'comment-123',
            username: 'johndoe',
            date: '2021-08-08T07:22:33.555Z',
            content: 'sebuah comment',
            replies: [
              {
                id: 'reply-123',
                username: 'dicoding',
                date: '2021-08-08T07:26:21.338Z',
                content: 'sebuah reply',
              },
            ],
          },
        ],
      },
    });

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
    expect(mockThreadRepository.getCommentsByThreadId).toHaveBeenCalledWith('thread-123');
    expect(mockThreadRepository.getRepliesByCommentId).toHaveBeenCalledWith('comment-123');
  });

  it('should orchestrating the get thread detail action correctly when comment and reply are deleted', async () => {
    const mockThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        isDelete: true,
      },
    ];

    const mockReplies = [
      {
        id: 'reply-123',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'sebuah reply',
        isDelete: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockThreadRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockThreadRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReplies));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute('thread-123');

    expect(threadDetail).toStrictEqual({
      thread: {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
        comments: [
          {
            id: 'comment-123',
            username: 'johndoe',
            date: '2021-08-08T07:22:33.555Z',
            content: '**komentar telah dihapus**',
            replies: [
              {
                id: 'reply-123',
                username: 'dicoding',
                date: '2021-08-08T07:26:21.338Z',
                content: '**balasan telah dihapus**',
              },
            ],
          },
        ],
      },
    });

    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-123');
    expect(mockThreadRepository.getCommentsByThreadId).toHaveBeenCalledWith('thread-123');
    expect(mockThreadRepository.getRepliesByCommentId).toHaveBeenCalledWith('comment-123');
  });
});
