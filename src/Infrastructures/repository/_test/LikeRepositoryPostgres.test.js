const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
    afterEach(async () => {
        await LikesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addLike function', () => {
        it('should persist like and return added like correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

            const fakeIdGenerator = () => '123';
            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await likeRepositoryPostgres.addLike('user-123', 'comment-123');

            // Assert
            const likes = await LikesTableTestHelper.findLikeById('like-123');
            expect(likes).toHaveLength(1);
        });
    });

    describe('deleteLike function', () => {
        it('should delete like from database', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
            await LikesTableTestHelper.addLike({ id: 'like-123', owner: 'user-123', commentId: 'comment-123' });

            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

            // Action
            await likeRepositoryPostgres.deleteLike('user-123', 'comment-123');

            // Assert
            const likes = await LikesTableTestHelper.findLikeById('like-123');
            expect(likes).toHaveLength(0);
        });
    });

    describe('checkLikeIsExists function', () => {
        it('should return true when like exists', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
            await LikesTableTestHelper.addLike({ id: 'like-123', owner: 'user-123', commentId: 'comment-123' });

            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

            // Action
            const isExists = await likeRepositoryPostgres.checkLikeIsExists('user-123', 'comment-123');

            // Assert
            expect(isExists).toBe(true);
        });

        it('should return false when like does not exist', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

            // Action
            const isExists = await likeRepositoryPostgres.checkLikeIsExists('user-123', 'comment-123');

            // Assert
            expect(isExists).toBe(false);
        });
    });
});
