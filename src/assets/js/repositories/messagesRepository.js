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

    async insetMessage(caretakerID, userID, message) {
        return await networkManager
            .doRequest(`${this.route}/insert`, {"caretakerID" : caretakerID, "userID": userID, "message": message}, "POST");
    }



}