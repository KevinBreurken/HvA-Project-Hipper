/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */
class HomeController extends CategoryController {

    username = sessionManager.get("username");

    assistant_Feedback = [ "Welkom " + this.username + " Je bent begonnen" ,
        "Hi " + this.username + " Je bent goed op weg",
        "hey " + this.username + " Je bent er bijna",
        "hey " + this.username + " Je zet de laatste puntje op de i"];

    constructor() {
        super();
        this.loadView("views/home.html");
        this.userRepository = new UserRepository();
        this.pamRepository = new PamRepository();
        this.rehabilitatorRepository = new RehabilitatorRepository();
    }


    //Called when the login.html has been loaded.
    async setup(data) {


        //Set the navigation to the correct state.
        nav.setNavigationState(navState.User)
        //Load the login-content into memory.
        this.view = $(data);
        $(".content").empty();
        //Set the navigation color to the correct CSS variable.
        this.updateCurrentCategoryColor("--color-category-goals");
        //Create the progress component.
        this.progressBar = await new ProgressComponent(this.view.find("#progress-anchor"));
        const pamdata = await this.progressBar.retrieveProgressData(sessionManager.get("userID"));
        this.progressBar.setProgressBarData(pamdata['total'], pamdata['current'], pamdata['daily']);
        //Empty the content-div and add the resulting view to the page
        $(".content").append(this.view);
        this.fillMotivationalContent(pamdata['total'], pamdata['current']);

        $("#pam-dailygoal-text").html(`<b>Om het PAM totaal te bereiken moet u voor vandaag ${pamdata['daily']} PAM punten behalen.</b>`);
        $('#today-text').html(`U bent al aardig onderweg! Voor vandaag heeft u een doel staan van  ${pamdata['daily']} PAM punten.
                kijk of u een nieuwe wandelroute of doel kan aannemen om uwzelf uit te dagen!`);
        const dateExpired = (pamdata['date'] < new Date());

        this.fillMotivationalContent(pamdata['total'], pamdata['current']);
        //Set the navigation color to the correct CSS variable.
        this.updateCurrentCategoryColor("--color-category-home");
        //Set the navigation to the correct state.
        nav.setNavigationState(navState.User)
        //Load the login-content into memory..
        this.view = $(data);
        console.log("hey")
        //Empty the content-div and add the resulting view to the page.
        $(".content").empty().append(this.view);

        const currentLoggedID = sessionManager.get("userID");
        const userData = await this.userRepository.getRehabilitatorInfo(currentLoggedID)
        // place currently logged user name in name var
        const name = userData[0].first_name
        //display random greeting sentence
this.view.find('#assistant_title')
        const greetingSentence = this.pickRandomGreeting();
        this.view.find("#welkom-text").html(`${greetingSentence} ${name}`);
        this.fitText();

        $(".cards").click(nav.handleClickMenuItem)
    }



    fillMotivationalContent(total, current) {

        const progresionIndex = this.calculateProgress(total, current);
        $('#assistant_title').empty().append(this.assistant_Feedback[progresionIndex]);
    }


    calculateProgress(total, current) {
        const progression = Math.floor((current / total) * 100);
        if (progression < 10) {
            return 0;
        } else if (progression < 50) {
            return 1;
        } else if (progression < 80) {
            return 2;
        } else if (progression < 100) {
            return 3;
        } else {
            return 4;
        }
    }


    pickRandomGreeting() {
        const zinnen = ["Goed je weer te zien", "Hoi", "Hallo"];
        const randomgetal = Math.floor(Math.random() * zinnen.length);
        return zinnen[randomgetal];
    }

    fitText() {
        const stringLength = this.pickRandomGreeting();
        if (stringLength > 29) {
            const element = document.getElementById("welkom-text");
            element.style.fontSize = "29px";
        }
    }
}