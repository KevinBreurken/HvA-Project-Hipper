/**
 * Repository responsible for all caretaker data from server - CRUD
 */
class CaretakerRepository {

    constructor() {
        this.route = "/caretaker"
    }

    async getAllRehab(userID, paginationPosition,amountPerPage) {
        return await networkManager
            .doRequest(`${this.route}/all/`, {"userID": userID, "paginationPosition": paginationPosition, "amountPerPage": amountPerPage}, "GET");
    }

    async getRehabCount(userID) {
        const data = await networkManager
            .doRequest(`${this.route}/all/count`, {"userID": userID}, "GET", false);
        return data[0]['count'];
    }
}