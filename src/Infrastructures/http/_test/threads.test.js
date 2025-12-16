const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };

      const { accessToken } = await AuthenticationsTableTestHelper.getAccessToken();

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      if (response.statusCode !== 201) {
        console.error('Error response:', responseJson);
      }
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual('sebuah thread');
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
        title: 'sebuah thread',
      };

      const { accessToken } = await AuthenticationsTableTestHelper.getAccessToken();

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 401 when request not contain access token', async () => {
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      expect(response.statusCode).toEqual(401);
    });
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      const threadId = 'thread-123';
      const requestPayload = {
        content: 'sebuah comment',
      };

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-123' });
      const { accessToken } = await AuthenticationsTableTestHelper.getAccessToken();

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual('sebuah comment');
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const threadId = 'thread-123';
      const requestPayload = {};

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-123' });
      const { accessToken } = await AuthenticationsTableTestHelper.getAccessToken();

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 404 when thread not found', async () => {
      const threadId = 'thread-123';
      const requestPayload = {
        content: 'sebuah comment',
      };

      const { accessToken } = await AuthenticationsTableTestHelper.getAccessToken();

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 when comment deleted successfully', async () => {
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const { accessToken, userId } = await AuthenticationsTableTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: userId,
        threadId,
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 when comment owner not match', async () => {
      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('secret', 10);

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'userA', password: hashedPassword });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'userB', password: hashedPassword });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: 'user-456',
        threadId,
      });
      const { accessToken } = await AuthenticationsTableTestHelper.getAccessToken('user-123', 'userA');

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread detail with comments and replies', async () => {
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'johndoe' });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123'
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'sebuah comment',
        owner: 'user-456',
        threadId,
      });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        content: 'sebuah reply',
        owner: 'user-123',
        commentId,
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toEqual(threadId);
      expect(responseJson.data.thread.title).toEqual('sebuah thread');
      expect(responseJson.data.thread.body).toEqual('sebuah body thread');
      expect(responseJson.data.thread.username).toEqual('dicoding');
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].id).toEqual(commentId);
      expect(responseJson.data.thread.comments[0].username).toEqual('johndoe');
      expect(responseJson.data.thread.comments[0].content).toEqual('sebuah comment');
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].replies[0].id).toEqual(replyId);
      expect(responseJson.data.thread.comments[0].replies[0].username).toEqual('dicoding');
      expect(responseJson.data.thread.comments[0].replies[0].content).toEqual('sebuah reply');
    });

    it('should response 200 and return thread detail with deleted comments and replies masked', async () => {
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'johndoe' });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123'
      });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        content: 'sebuah comment',
        owner: 'user-456',
        threadId,
        isDelete: true,
      });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        content: 'sebuah reply',
        owner: 'user-123',
        commentId,
        isDelete: true,
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].content).toEqual('**komentar telah dihapus**');
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].replies[0].content).toEqual('**balasan telah dihapus**');
    });

    it('should response 404 when thread not found', async () => {
      const threadId = 'thread-123';

      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const requestPayload = {
        content: 'sebuah reply',
      };

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-123' });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: 'user-123',
        threadId,
      });
      const { accessToken } = await AuthenticationsTableTestHelper.getAccessToken();

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toEqual('sebuah reply');
      expect(responseJson.data.addedReply.owner).toBeDefined();
    });

    it('should response 404 when comment not found', async () => {
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const requestPayload = {
        content: 'sebuah reply',
      };

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: 'user-123' });
      const { accessToken } = await AuthenticationsTableTestHelper.getAccessToken();

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 when reply deleted successfully', async () => {
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';

      const { accessToken, userId } = await AuthenticationsTableTestHelper.getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: userId,
        threadId,
      });
      await RepliesTableTestHelper.addReply({
        id: replyId,
        owner: userId,
        commentId,
      });

      const server = await createServer(container);

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
