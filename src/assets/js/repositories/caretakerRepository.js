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
}