class GetThreadDetailUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const rawComments = await this._threadRepository.getCommentsByThreadId(threadId);

    const comments = await Promise.all(
      rawComments.map(async (comment) => {
        const rawReplies = await this._threadRepository.getRepliesByCommentId(comment.id);

        const replies = rawReplies.map((reply) => ({
          id: reply.id,
          content: reply.isDelete ? '**balasan telah dihapus**' : reply.content,
          date: reply.date,
          username: reply.username,
        }));

        return {
          id: comment.id,
          username: comment.username,
          date: comment.date,
          content: comment.isDelete ? '**komentar telah dihapus**' : comment.content,
          replies,
        };
      })
    );

    return {
      thread: {
        id: thread.id,
        title: thread.title,
        body: thread.body,
        date: thread.date,
        username: thread.username,
        comments,
      },
    };
  }
}

module.exports = GetThreadDetailUseCase;
