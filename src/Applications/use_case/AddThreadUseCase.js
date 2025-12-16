const AddThread = require('../../Domains/threads/entities/AddThread');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { title, body, owner } = useCasePayload;
    const addThread = new AddThread({ title, body, owner });

    const addedThread = await this._threadRepository.addThread(addThread);

    return new AddedThread({
      id: addedThread.id,
      title: addedThread.title,
      owner: addedThread.owner,
    });
  }
}

module.exports = AddThreadUseCase;
