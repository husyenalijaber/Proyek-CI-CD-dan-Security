const GettedComment = require('../GettedComment');

describe('a GettedComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            username: 'dicoding',
            content: 'sebuah comment',
            date: '2021-08-08T07:22:33.555Z',
        };

        expect(() => new GettedComment(payload)).toThrowError('GETTED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            username: 'dicoding',
            content: 'sebuah comment',
            date: '2021-08-08T07:22:33.555Z',
            is_delete: 'true',
            likeCount: '0',
        };

        expect(() => new GettedComment(payload)).toThrowError('GETTED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create GettedComment object correctly', () => {
        const payload = {
            id: 'comment-123',
            username: 'dicoding',
            content: 'sebuah comment',
            date: '2021-08-08T07:22:33.555Z',
            is_delete: false,
            likeCount: 0,
        };

        const { id, username, content, date, isDelete, likeCount } = new GettedComment(payload);

        expect(id).toEqual(payload.id);
        expect(username).toEqual(payload.username);
        expect(content).toEqual(payload.content);
        expect(date).toEqual(payload.date);
        expect(isDelete).toEqual(payload.is_delete);
        expect(likeCount).toEqual(payload.likeCount);
    });
});
