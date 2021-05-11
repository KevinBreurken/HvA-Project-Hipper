/**
 * Repository responsible for all caretaker data from server - CRUD
 */
class CaretakerRepository {

    constructor() {
        this.route = "/caretaker"
    }

    async getAllRehab(userID, paginationPosition) {
        // return await networkManager
        //     .doRequest(`${this.route}/all`, {"userID": userID, "paginationPosition": paginationPosition}, "POST");
        return await networkManager
            .doRequest(`${this.route}/all/`, {"userID": userID, "paginationPosition": paginationPosition}, "GET");
    }

    async getRehabCount(userID) {
        const page = 1;
        return await networkManager
            .doRequest(`${this.route}/all/count`, {"userID": userID}, "GET", false);
    }
}