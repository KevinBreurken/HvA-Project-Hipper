/**
 * Repository responsible for all user data from server - CRUD
 * Make sure all functions are using the async keyword when interacting with network!
 *
 */
class RehabilitatorRepository {

    constructor() {
        this.route = "/rehabilitator"
    }

    async getTotalGoal(id) {
        return await networkManager
            .doRequest(`${this.route}/goal/total`, {"id": id}, "POST");
    }

    async getPamActivities(id){
        return await networkManager
            .doRequest(`${this.route}/activities`, {"id": id}, "POST");
    }
    async getAppointmentDate(id){
        return await networkManager
            .doRequest(`${this.route}/goal/date`, {"id": id}, "POST");
    }
}
