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
        await this.createPatients(data);
    }

    async createPatients(data){
        for (let i = 0; i < data.length; i++) {
            var id = data[i].id
            var obtained = await this.getAllPam(id);
            var name = data[i].first_name + " " + data[i].last_name;
            var date = this.improveDate(data[i].appointment_date);
            var score = await this.getPam(id);
            var calc = await this.calculateGoal(data[i].appointment_date, data[i].pam_goal_total, obtained);
            await this.addData(name, date, score, calc, obtained);
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
        const toDo = totalgoal - obtained;
        if (toDo/daysToGo < 1 && toDo/daysToGo !== 0){
            return "<1"
        }
        return toDo/daysToGo;

    }

    getToday(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        return yyyy + '/' + mm + '/' + dd;
    }

    improveDate(date){
        if (typeof date === typeof " "){
            return (date.substring(0, 10))
        }
        return "Geen datum"
    }

    async addData(name, date, score, calc, total){
        let row;
        if (calc > score){
            row = "table-warning";
        }
        $("#table-data").append("<tr class='" + row + "'>" +
            "    <td>" + name + "</td>\n" +
            "    <td>" + date + "</td>\n" +
            "    <td>" + calc + "</td>\n" +
            "    <td>" + score + "</td>\n" +
            "    <td>" + total + "</td>\n" + "</tr>");
    }
}