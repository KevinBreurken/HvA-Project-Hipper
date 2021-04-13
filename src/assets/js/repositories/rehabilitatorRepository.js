/**
 * Repository responsible for all user data from server - CRUD
 * Make sure all functions are using the async keyword when interacting with network!
 *
 */
class RehabilitatorRepository {

    constructor() {
        this.route = "/rehabilitator"
    }

    async getPamDailyGoal(id) {
        return await networkManager
            .doRequest(`${this.route}/goal/daily`, {"id": id}, "POST");
    }

}