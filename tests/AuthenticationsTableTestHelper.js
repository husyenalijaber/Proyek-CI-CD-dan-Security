/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
const container = require('../src/Infrastructures/container');
const createServer = require('../src/Infrastructures/http/createServer');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const AuthenticationsTableTestHelper = {
  async addToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await pool.query(query);
  },

  async findToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async getAccessToken(userId = null, username = null) {
    const randomId = Math.random().toString(36).substring(7);
    const finalUserId = userId || `user-${randomId}`;
    const finalUsername = username || `dicoding_${randomId}`;
    const bcrypt = require('bcrypt');
    
    const hashedPassword = await bcrypt.hash('secret', 10);
    
    if (!userId && !username) {
      await UsersTableTestHelper.addUser({
        id: finalUserId,
        username: finalUsername,
        password: hashedPassword,
        fullname: 'Dicoding Indonesia'
      });
    }

    const server = await createServer(container);
    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: finalUsername,
        password: 'secret',
      },
    });

    const responseJson = JSON.parse(response.payload);
    if (responseJson.status === 'success' && responseJson.data) {
      return { accessToken: responseJson.data.accessToken, userId: finalUserId };
    }
    console.error('Login failed:', response.statusCode, responseJson);
    throw new Error(`Failed to get access token: ${JSON.stringify(responseJson)}`);
  },

  async cleanTable() {
    await pool.query('DELETE FROM authentications WHERE 1=1');
  },
};

module.exports = AuthenticationsTableTestHelper;
