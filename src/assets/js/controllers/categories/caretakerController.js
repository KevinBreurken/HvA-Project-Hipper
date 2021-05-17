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
            var id = data[i].id
            var obtained = await this.getAllPam(id);
            console.log("naam:  " + data[i].first_name + data[i].last_name);
            console.log("datum: " + data[i].appointment_date);
            console.log("id:    " + id);
            console.log("score: " + await this.getPam(id));
            console.log("total: " + obtained)
            console.log("calc:  " + await this.calculateGoal(data[i].appointment_date, data[i].pam_goal_total, obtained))
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

    async getAllPam(id){
        const allScore = await this.pamRepository.getAllScore(id);
        if(typeof allScore[0].total_score === typeof 1){
            return allScore[0].total_score;
        } else if (allScore.length > 1) {
            console.error("Something went wrong");
        }
        return 0;
    }

    async calculateGoal(datum, totalgoal, obtained){
        //checks diffirence between dates
        //copied from: https://www.codegrepper.com/code-examples/javascript/javascript+find+out+distance+between+dates
        const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
        const daysToGo = diffDays(new Date(datum), new Date(this.getToday()));
        console.log(daysToGo);
        const toDo = totalgoal - obtained;
        console.log(toDo);
        return toDo/daysToGo;

    }

    getToday(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        return yyyy + '/' + mm + '/' + dd;
    }
}