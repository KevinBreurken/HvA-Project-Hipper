/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */
class PatientsController extends CategoryController {

    constructor() {
        super();
        this.loadView("views/caretaker/patients.html");
        this.caretakerRepository = new CaretakerRepository();
    }

    //Called when the login.html has been loaded.
    setup(data) {
        //Set the navigation color to the correct CSS variable.
        this.updateCurrentCategoryColor("--color-category-default");
        //Set the navigation to the correct state.
        nav.setNavigationState(navState.Caretaker)
        //Load the login-content into memory.
        this.view = $(data);

        //Empty the content-div and add the resulting view to the page.
        $(".content").empty().append(this.view);

        this.caretakerRepository.getAllRehab(sessionManager.get("userID")).then(data => {
            this.createPatients(data)
        });
    }

    /**
     * here you set all data from the database in html
     * @param patients
     */
    createPatients(patients) {
        let blocky = $(".block-primary");
        for (let i = 0; i < patients.length; i++) {
            blocky.clone().insertAfter(blocky);
            blocky.attr('class', 'block-' + i + ' row justify-content-md-center mt-5')
            //set the data in html
            $(".ct-name", blocky).text(patients[i].name);
            $(".ct-year", blocky).text("Leeftijd: " + this.getAge(patients[i].birthdate));
            $(".ct-gender", blocky).text("Geslacht: " + patients[i].gender);
            $(".ct-bloodtype", blocky).text("Bloed type: " + patients[i].bloodtype);
            $(".ct-status", blocky).text("Status: " + patients[i].status);
            $(".ct-phonenumber", blocky).text("Mobiel: " + patients[i].phonenumber);
            $(".ct-mail", blocky).text("Email: " + patients[i].email);
            $(".ct-description", blocky).text(patients[i].description);
            //img changing to men
            if (patients[i].gender === "Vrouw"){
                blocky.find(".imgpatient").attr('src','assets/img/patient2.png')
            } else {
                blocky.find(".imgpatient").attr('src','assets/img/patient1.png')
            }
        }
        $(".block-primary").remove();
    }

    /**
     * here you calculate the age of the patient
     * @param dateString
     * @returns {number}
     */
    getAge(dateString) {
        let today = new Date();
        let birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}
