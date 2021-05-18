/**
 * Repository responsible for all caretaker data from server - CRUD
 */
class MessagesRepository {

    constructor() {
        this.route = "/messages"
    }

    async getAllMessages(userID) {
        return await networkManager
            .doRequest(`${this.route}`, {"userID": userID}, "POST");
    }

    async getAllMyMessages(userID) {
        return await networkManager
            .doRequest(`${this.route}/me`, {"userID": userID}, "POST");
    }


    async insertMessage(caretakerID, userID, message, date) {
        return await networkManager
            .doRequest(`${this.route}/insert`, {
                "caretakerID": caretakerID,
                "userID": userID,
                "message": message,
                "date": date
            }, "POST");
    }

    async deleteMessage(message) {
        return await networkManager
            .doRequest(`${this.route}/delete`, {"messageID": message}, "POST");
    }


}