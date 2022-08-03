class RealTimeService {
  setSocket(io, socket) {
    this.io = io;
    this.socket = socket;

    this.socket.on('user_connected', (data) => {
      if (data) {
        const { user_id } = data;
        if (user_id) socket.join(user_id);
      }
    });

    this.socket.on('user_disconnected', (data) => {
      if (data) {
        const { user_id } = data;
        if (user_id) socket.leave(user_id);
      }
    });
  }

  /**
   * @description send event to perticular group of users like all company user
   */
  async emitToCompany(subscriber_group_id, event_name, payload) {
    try {
      if (this.io) {
        this.io.sockets.to(subscriber_group_id).emit(event_name, payload);
      }
    } catch (e) {
      console.log('ERROR while emit realtime error', e);
    }
  }
}

const service = new RealTimeService();
module.exports = service;
