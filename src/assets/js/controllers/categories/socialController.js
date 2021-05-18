/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */

class SocialController extends CategoryController {

    constructor() {
        super();
        this.loadView("views/social.html");
        this.userRepository = new UserRepository();
        this.messagesRepository = new MessagesRepository();
    }

    //Called when the login.html has been loaded.
    async setup(data) {
        //Set the navigation color to the correct CSS variable.
        this.updateCurrentCategoryColor("--color-category-social");
        //Set the navigation to the correct state.
        nav.setNavigationState(navState.User)
        //Load the login-content into memory.
        this.view = $(data);

        //Empty the content-div and add the resulting view to the page.
        $(".content").empty().append(this.view);
        await this.retrieveCaretakerInfo();
        await this.retrieveOtherMessages();
        await this.getMyMessages();
        this.addEventListeners()

    }

    async retrieveCaretakerInfo() {
        try {
            const currentLoggedID = sessionManager.get("userID");
            const roomData = await this.userRepository.getCaretakerInfo(currentLoggedID);
            const caretakerID = roomData[0].caretaker_id;
            const fullname = roomData[0].first_name + " " + roomData[0].last_name

            document.querySelectorAll(".name_caretaker").forEach((element) => {
                element.innerText = fullname
            })
            document.querySelector(".phone_caretaker").innerText = roomData[0].phone
            document.querySelector(".email_caretaker").innerText = roomData[0].email
            document.querySelector(".experience1_caretaker").innerText = roomData[0].experience_field1
            document.querySelector(".experience2_caretaker").innerText = roomData[0].experience_field2
            document.querySelector(".experience3_caretaker").innerText = roomData[0].experience_field3
            document.querySelector(".description_caretaker").innerText = roomData[0].description
            //profile pic
            document.querySelector(".profile_pic_caretaker").src = `assets/img/caretaker/${caretakerID}_profile_pic.png`;
            return caretakerID;
        } catch (e) {
            console.log("error while fetching rooms", e);
        }
    }


    async getMyMessages() {
        try {
            const currentLoggedUserID = sessionManager.get("userID");
            const userData = await this.userRepository.getRehabilitatorInfo(currentLoggedUserID)
            const rehabilitatorID = userData[0].id;
            const messages = await this.messagesRepository.getAllMyMessages(rehabilitatorID);
            const messagesHtml = messages.map(message => (
                `<div class="message mb-2" >
                    <p style="padding-bottom: 20px; border-bottom:2px solid var(--color-category-current);">
                    <b>OP ${message.date.split("T")[0]}</b> <br>
                         
                         ${message.content}
                         ${message.message_id}
                         <button class="btn-delete" data-message-id="${message.message_id}">Verwijder</button>
                    </p>
                </div>  
               `))

            $("#my-messages").html(messagesHtml)
        } catch (e) {
            console.log("error while fetching rooms", e);
        }
    }

    async deleteMessage(messageID) {
        const result = confirm("weet je zeker dat je bericht wilt verwijderen")
        if (result) {
            await this.messagesRepository.deleteMessage(messageID);
            location.reload();
        }
    }

    async retrieveOtherMessages() {
        try {
            const currentLoggedID = sessionManager.get("userID");
            const messages = await this.messagesRepository.getAllMessages(currentLoggedID);
            const messagesHtml = messages.map(message => {
                const age = Utils.getAge(message.birthdate)
                return (`
                    <b>OP ${message.date.split("T")[0]}</b> <br>
                    <h2 class="mb-2"><b>${message.first_name}  ${age} jaar</b></h2>
                        <p style="padding-bottom: 20px; border-bottom:2px solid var(--color-category-current);">
                            ${message.content}
                        </p>  
                    `)
            });
            $("#social-messages").html(messagesHtml);

        } catch (e) {
            console.log("error while fetching rooms", e);
        }

    }

    async sendMessage(message) {
        const caretakerID = await this.retrieveCaretakerInfo()
        const currentLoggedUserID = sessionManager.get("userID");
        const roomdata = await this.userRepository.getRehabilitatorInfo(currentLoggedUserID)
        const userID = roomdata[0].id;

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '/' + mm + '/' + dd;
        await this.messagesRepository.insertMessage(caretakerID, userID, message, today);
    }

    getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}