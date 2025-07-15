const LiveChatHandler = require('./LiveChatHandler');
const PrivateMessageHandler = require('./PrivateMessageHandler');
const RoomMessageHandler = require('./RoomMessageHandler');

class MessageHandlerFactory {
  constructor(connectedUsers) {
    this.connectedUsers = connectedUsers;
    this.handlers = new Map();
    this._initializeHandlers();
  }

  _initializeHandlers() {
    this.handlers.set('room', new RoomMessageHandler());
    this.handlers.set(
      'private',
      new PrivateMessageHandler(this.connectedUsers)
    );
    this.handlers.set('live', new LiveChatHandler());
  }

  getHandler(messageType) {
    const handler = this.handlers.get(messageType);
    if (!handler) {
      throw new Error(`Unknown message type: ${messageType}`);
    }
    return handler;
  }
}

module.exports = MessageHandlerFactory;
