/**
 * Repository responsible for all user data from server - CRUD
 * Make sure all functions are using the async keyword when interacting with network!
 *
 */
class SocialRepository {

    constructor() {
        this.route = "/social"
    }

    async getAll() {

    }

    async delete() {

    }

    async getSocialMessage(message_id) {
        return await networkManager
            .doRequest(`${this.route}`, {"id": message_id}, "POST");
    }

    async update(messageid, values = {}) {

    }
}