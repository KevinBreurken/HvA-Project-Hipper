/**
 * Repository responsible for all caretaker data from server - CRUD
 */
class CaretakerRepository {

    constructor() {
        this.route = "/caretaker"
    }

    async getAllRehab(userID, paginationPosition) {
        return await networkManager
            .doRequest(`${this.route}/all`, {"userID": userID, "paginationPosition": paginationPosition}, "POST");
    }

    async getRehabCount(userID) {
        return await networkManager
            .doRequest(`${this.route}/all/count`, {"userID": userID}, "POST");
    }
}