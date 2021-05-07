/**
 * Repository responsible for all caretaker data from server - CRUD
 */
class CaretakerRepository {

    constructor() {
        this.route = "/caretaker"
    }

    async getAllRehab(userID) {
        return await networkManager
            .doRequest(`${this.route}/all`, {"userID": userID}, "POST");
    }

    async getUserInfo(userID) {
        return await networkManager
            .doRequest(`${this.route}/user`, {"userID": userID});
    }

    async getLoggedInCaretakerId(userID) {
        return await networkManager
            .doRequest(`${this.route}/getId`, {"userID": userID});
    }
}