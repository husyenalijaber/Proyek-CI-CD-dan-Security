const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddComment = require('../../../Domains/threads/entities/AddComment');
const AddReply = require('../../../Domains/threads/entities/AddReply');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddedComment = require('../../../Domains/threads/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding_addthread' });

      const addThread = new AddThread({
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.getThreadById('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding_getthread' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      await expect(threadRepositoryPostgres.getThreadById('thread-123')).resolves.not.toThrowError(NotFoundError);
      expect(thread.id).toEqual('thread-123');
      expect(thread.title).toEqual('sebuah thread');
      expect(thread.body).toEqual('sebuah body thread');
      expect(thread.date).toBeDefined();
      expect(thread.username).toEqual('dicoding_getthread');
    });
  });

  describe('verifyThreadExists function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyThreadExists('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding_verifythread_found' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyThreadExists('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding_addcomment' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const addComment = new AddComment({
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await threadRepositoryPostgres.addComment(addComment);

      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      }));
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding_getcomments' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const comments = await threadRepositoryPostgres.getCommentsByThreadId('thread-123');

      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual('comment-123');
      expect(comments[0].username).toEqual('dicoding_getcomments');
      expect(comments[0].content).toEqual('sebuah comment');
      expect(comments[0].isDelete).toEqual(false);
      expect(comments[0].likeCount).toEqual(0);
    });

    it('should return comments with raw data including isDelete field when comment is deleted', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding_deleted_comment' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
        isDelete: false,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await threadRepositoryPostgres.deleteComment('comment-123');
      const comments = await threadRepositoryPostgres.getCommentsByThreadId('thread-123');

      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual('comment-123');
      expect(comments[0].username).toEqual('dicoding_deleted_comment');
      expect(comments[0].content).toEqual('sebuah comment');
      expect(comments[0].isDelete).toEqual(true);
      expect(comments[0].likeCount).toEqual(0);
    });
  });

  describe('deleteComment function', () => {
    it('should soft delete comment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding_verifythread' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await threadRepositoryPostgres.deleteComment('comment-123');

      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments[0].is_delete).toEqual(true);

      const getComments = await threadRepositoryPostgres.getCommentsByThreadId('thread-123');
      expect(getComments[0].isDelete).toEqual(true);
    });
  });

  describe('verifyCommentExists function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyCommentExists('comment-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding_verifythread' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyCommentExists('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when comment owner not match', async () => {
      const randomId = Math.random().toString(36).substring(7);
      const userId1 = `user-comment-owner-1-${randomId}`;
      const userId2 = `user-comment-owner-2-${randomId}`;
      await UsersTableTestHelper.addUser({ id: userId1, username: `dicoding_comment_owner_test_1_${randomId}` });
      await UsersTableTestHelper.addUser({ id: userId2, username: `dicoding_comment_owner_test_2_${randomId}` });
      await ThreadsTableTestHelper.addThread({ id: `thread-comment-owner-${randomId}`, owner: userId1 });
      await CommentsTableTestHelper.addComment({
        id: `comment-owner-test-${randomId}`,
        owner: userId1,
        threadId: `thread-comment-owner-${randomId}`,
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyCommentOwner(`comment-owner-test-${randomId}`, userId2)).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error when comment owner match', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding_comment_owner_match' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError();
    });
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding_addreply' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const addReply = new AddReply({
        content: 'sebuah reply',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addReply(addReply);

      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return replies correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding_getreplies' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const replies = await threadRepositoryPostgres.getRepliesByCommentId('comment-123');

      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual('reply-123');
      expect(replies[0].username).toEqual('dicoding_getreplies');
      expect(replies[0].content).toEqual('sebuah reply');
      expect(replies[0].isDelete).toEqual(false);
    });

    it('should return replies with raw data including isDelete field when reply is deleted', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding_deleted_reply' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
        commentId: 'comment-123',
        isDelete: false,
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await threadRepositoryPostgres.deleteReply('reply-123');
      const replies = await threadRepositoryPostgres.getRepliesByCommentId('comment-123');

      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual('reply-123');
      expect(replies[0].username).toEqual('dicoding_deleted_reply');
      expect(replies[0].content).toEqual('sebuah reply');
      expect(replies[0].isDelete).toEqual(true);
    });
  });

  describe('deleteReply function', () => {
    it('should soft delete reply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding_verifythread' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await threadRepositoryPostgres.deleteReply('reply-123');

      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies[0].is_delete).toEqual(true);

      const getReplies = await threadRepositoryPostgres.getRepliesByCommentId('comment-123');
      expect(getReplies[0].isDelete).toEqual(true);
    });
  });

  describe('verifyReplyExists function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyReplyExists('reply-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding_verifythread' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyReplyExists('reply-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when reply owner not match', async () => {
      const randomId = Math.random().toString(36).substring(7);
      const userId1 = `user-reply-owner-1-${randomId}`;
      const userId2 = `user-reply-owner-2-${randomId}`;
      await UsersTableTestHelper.addUser({ id: userId1, username: `dicoding_reply_owner_test_1_${randomId}` });
      await UsersTableTestHelper.addUser({ id: userId2, username: `dicoding_reply_owner_test_2_${randomId}` });
      await ThreadsTableTestHelper.addThread({ id: `thread-reply-owner-${randomId}`, owner: userId1 });
      await CommentsTableTestHelper.addComment({
        id: `comment-reply-owner-${randomId}`,
        owner: userId1,
        threadId: `thread-reply-owner-${randomId}`,
      });
      await RepliesTableTestHelper.addReply({
        id: `reply-owner-test-${randomId}`,
        owner: userId1,
        commentId: `comment-reply-owner-${randomId}`,
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyReplyOwner(`reply-owner-test-${randomId}`, userId2)).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error when reply owner match', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding_reply_owner_match' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        owner: 'user-123',
        threadId: 'thread-123',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrowError();
    });
  });
});
