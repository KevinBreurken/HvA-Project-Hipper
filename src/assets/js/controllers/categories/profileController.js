/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */


class ProfileController extends CategoryController {
    constructor() {
        super();
        this.loadView("views/profile.html");
        this.userRepository = new UserRepository();
    }

    //Called when the login.html has been loaded.
    setup(data) {
        //Set the navigation color to the correct CSS variable.
        this.updateCurrentCategoryColor("--color-category-profile");
        //Set the navigation to the correct state.
        nav.setNavigationState(navState.User)
        //Load the login-content into memory.
        this.view = $(data);

        //Empty the content-div and add the resulting view to the page.
        $(".content").empty().append(this.view);
        this.retrieveUserInfo();

    }

    async retrieveUserInfo() {
        try {
            const currentID = sessionManager.get("userID");
            const roomData = await this.userRepository.getUserInfo(currentID);
            //convert birthdate to string
            var birthdate = roomData[0].Birthdate
            var birthdateString = birthdate.toString();
            var age = this.getAge(birthdateString)

            console.log(roomData)
            document.getElementById("name").innerText = roomData[0].Name
            document.getElementById("age").innerText = age
            document.getElementById("adress").innerText = roomData[0].Adress
            document.getElementById("bloodtype").innerText = roomData[0].Bloodtype
            document.getElementById("description").innerText = roomData[0].Description
            document.getElementById("postalcode").innerText = roomData[0].Postalcode
            //profile pic
            document.getElementById("profile_pic").src = `assets/img/rehabilitator/${currentID}_profile_pic.png`;

        } catch (e) {
            console.log("error while fetching rooms", e);
        }

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