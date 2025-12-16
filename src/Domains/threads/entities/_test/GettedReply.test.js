const GettedReply = require('../GettedReply');

describe('a GettedReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            username: 'dicoding',
            content: 'sebuah reply',
            date: '2021-08-08T07:22:33.555Z',
        };

        expect(() => new GettedReply(payload)).toThrowError('GETTED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            username: 'dicoding',
            content: 'sebuah reply',
            date: '2021-08-08T07:22:33.555Z',
            is_delete: 'true',
        };

        expect(() => new GettedReply(payload)).toThrowError('GETTED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create GettedReply object correctly', () => {
        const payload = {
            id: 'reply-123',
            username: 'dicoding',
            content: 'sebuah reply',
            date: '2021-08-08T07:22:33.555Z',
            is_delete: false,
        };

        const { id, username, content, date, isDelete } = new GettedReply(payload);

        expect(id).toEqual(payload.id);
        expect(username).toEqual(payload.username);
        expect(content).toEqual(payload.content);
        expect(date).toEqual(payload.date);
        expect(isDelete).toEqual(payload.is_delete);
    });
});
