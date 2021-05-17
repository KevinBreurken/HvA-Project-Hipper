/**
 * Responsible for handling the actions happening on welcome view
 * For now it uses the roomExampleRepository to get some example data from server
 *
 * @author Lennard Fonteijn & Pim Meijer
 */
class CaretakerController extends CategoryController {

    constructor() {
        super();
        this.loadView("views/caretaker/home.html");
        this.caretakerRepository = new CaretakerRepository();
        this.rehabilitatorRepository = new RehabilitatorRepository();
        this.pamRepository = new PamRepository();
    }

    //Called when the home.html has been loaded
    async setup(data) {
        //Set the navigation color to the correct CSS variable.
        this.updateCurrentCategoryColor("--color-category-default");
        //Set the navigation to the correct state.
        nav.setNavigationState(navState.Caretaker);
        //Load the welcome-content into memory
        this.caretakerView = $(data);

        //Set the name in the view from the session
        this.caretakerView.find(".name").html(sessionManager.get("username"));

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.caretakerView);

        //add the patient overview
        await this.initializeTable()
    }

    //create the table
    async initializeTable(){
        const data = await this.caretakerRepository.getAllRehab(sessionManager.get("userID"));
        console.log(data);
        await this.createPatients(data);
    }

    async createPatients(data){
        for (let i = 0; i < data.length; i++) {
            console.log("naam:  " + data[i].first_name + data[i].last_name);
            console.log("datum: " + data[i].appointment_date);
            console.log("id:    " + data[i].id);
            var score = await this.getPam(data[i].id);
            console.log("score: " + score);
        }
    }

    async getPam(id){
        const score = await this.pamRepository.getScore(id);
        if(score.length === 1){
            return score[0].pam_score
        } else if (score.length > 1) {
            console.error("Something went wrong");
        }
        return 0;
    }
}