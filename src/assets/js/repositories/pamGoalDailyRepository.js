/**
 * Repository responsible for all user data from server - CRUD
 * Make sure all functions are using the async keyword when interacting with network!
 *
 */
class PamGoalDailyRepository {

    constructor() {
        this.route = "/pam/goal/daily"
    }

    async getPamDailyGoal(id) {
        return await networkManager
            .doRequest(`${this.route}`, {"id": id}, "POST");
    }

}