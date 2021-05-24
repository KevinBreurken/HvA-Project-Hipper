/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

// Set the caretaker info
let caretakerData;
class CaretakerProfileController extends CategoryController {

    constructor() {
        super();
        this.loadView("views/caretaker/profile.html");
        this.userRepository = new UserRepository();
        this.caretakerRepository = new CaretakerRepository();
    }

    //Called when the home.html has been loaded
    async setup(data) {
        //Set the navigation color to the correct CSS variable.
        this.updateCurrentCategoryColor("--color-category-default");
        //Set the navigation to the correct state.
        nav.setNavigationState(navState.Caretaker);
        //Load the welcome-content into memory
        this.caretakerView = $(data);

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.caretakerView);

        // Set the caretakerinfo
        this.getCaretakerInfo();

        // once the modal is opened, set up the modal
        $(document).on("click", ".btn-edit--profile", (e) => {
            this.fillProfileEdit();
        });

        this.caretakerView.find(".edit-form").on("submit", (data) => this.saveProfile(data));
    }

    async getCaretakerInfo() {
        try {
            const currentLoggedID = sessionManager.get("userID");
            caretakerData = await this.caretakerRepository.getLoggedInCaretakerInfo(currentLoggedID);
            console.log(caretakerData);
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
            console.log("Foutgegaan tijdens het opzetten: ", e);
        }
    }

    /**
     * Fill the profile editor
     */
    fillProfileEdit() {
        // Set the values
        $("#firstNameEdit").val(caretakerData[0].first_name);
        $("#lastNameEdit").val(caretakerData[0].last_name);
        $("#emailEdit").val(caretakerData[0].email);
        $("#descriptionEdit").val(caretakerData[0].description);
        $("#phoneEdit").val(caretakerData[0].phone);
        $("#experienceOneEdit").val(caretakerData[0].experience_field1)
        $("#experienceTwoEdit").val(caretakerData[0].experience_field2)
        $("#experienceThreeEdit").val(caretakerData[0].experience_field3)
    }

    /**
     * Save the edited files.
     */
    saveProfile(data) {
        data.preventDefault();
        let editValues = this.getEditValues();

        try {
            this.caretakerRepository.saveCaretaker(sessionManager.get("userID"), editValues).then((r) => {
                console.log(r);
            })
        } catch (e) {
            console.log(e)
        }
    }

    getEditValues() {
        let firstname = $("#firstNameEdit").val();
        let lastname = $("#lastNameEdit").val();
        let email = $("#emailEdit").val();
        let description = $("#descriptionEdit").val();
        let phone = $("#phoneEdit").val();
        let experience_one = $("#experienceOneEdit").val();
        let experience_two = $("#experienceTwoEdit").val();
        let experience_three = $("#experienceThreeEdit").val();

        let valuesToGive = [];
        valuesToGive.push({"firstname": firstname, "lastname": lastname, "email": email, "description": description, "phone": phone, "experience_one": experience_one,
        "experience_two": experience_two, "experience_three": experience_three});

        return valuesToGive;
    }
}