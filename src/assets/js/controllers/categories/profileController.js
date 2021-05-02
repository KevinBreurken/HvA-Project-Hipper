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
        this.retrieveRehabilitatorInfo();
        this.retrieveCaretakerInfo();

    }

    async retrieveRehabilitatorInfo() {
        try {
            const currentLoggedID = sessionManager.get("userID");
            const rehabilitatorData = await this.userRepository.getRehabilitatorInfo(currentLoggedID);
            //convert birthdate to string
            var birthdate = rehabilitatorData[0].Birthdate
            var birthdateString = birthdate.toString();
            var age = this.getAge(birthdateString)

            console.log(rehabilitatorData)
            const fullname = rehabilitatorData[0].first_name + " " + rehabilitatorData[0].last_name
            document.querySelectorAll(".name_rehabilitator").forEach((element) => {
                element.innerText = fullname
            })
            document.querySelector(".age_rehabilitator").innerText = age
            document.querySelector(".adress_rehabilitator").innerText = rehabilitatorData[0].Adress
            document.querySelector(".bloodtype_rehabilitator").innerText = rehabilitatorData[0].Bloodtype
            document.querySelector(".description_rehabilitator").innerText = rehabilitatorData[0].Description
            document.querySelector(".postalcode_rehabilitator").innerText = rehabilitatorData[0].Postalcode
            // //profile pic
            // document.querySelector(".profile_pic_rehabilitator").src =
            //     rehabilitatorData[0]['Gender'] === "Vrouw" ? 'assets/img/patient2.png' : 'assets/img/patient1.png';
            if (rehabilitatorData[0].foto != null) {
                var foto = rehabilitatorData[0].foto;
                $(".profile_pic_rehabilitator").attr("src", foto);
            }

        } catch (e) {
            console.log("error while fetching rooms", e);
        }

    }

    async retrieveCaretakerInfo() {
        try {
            const currentLoggedID = sessionManager.get("userID");
            const caretakerData = await this.userRepository.getCaretakerInfo(currentLoggedID);
            console.log(currentLoggedID)
            console.log(caretakerData)
            const caretakerID = caretakerData[0].caretaker_id;
            const fullname = caretakerData[0].first_name + " " + caretakerData[0].last_name

            document.querySelectorAll(".name_caretaker").forEach((element) => {
                element.innerText = fullname
            })
            document.querySelector(".phone_caretaker").innerText = caretakerData[0].phone
            document.querySelector(".email_caretaker").innerText = caretakerData[0].email
            document.querySelector(".experience1_caretaker").innerText = caretakerData[0].experience_field1
            document.querySelector(".experience2_caretaker").innerText = caretakerData[0].experience_field2
            document.querySelector(".experience3_caretaker").innerText = caretakerData[0].experience_field3
            document.querySelector(".description_caretaker").innerText = caretakerData[0].description
            //profile pic
            document.querySelector(".profile_pic_caretaker").src = `assets/img/caretaker/${caretakerID}_profile_pic.png`;

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
    // loadFile = function(event) {
    //     var image = document.getElementById('file_uploader');
    //     image.src = URL.createObjectURL(event.target.files[0]);
    // };
}