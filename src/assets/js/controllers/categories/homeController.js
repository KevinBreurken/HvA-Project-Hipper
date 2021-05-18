/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */
class HomeController extends CategoryController {
    username = sessionManager.get("username");

    virtualContent = [ "Welkom " + this.username + " Je bent begonnen" ,
        "Hi " + this.username + " Je bent goed op weg",
        "hey " + this.username + " Je bent er bijna",
        "hey " + this.username + " Je zet de laatste puntje op de i"];

    constructor() {
        super();
        this.loadView("views/home.html");
    }

    //Called when the login.html has been loaded.
    setup(data) {
        //Set the navigation color to the correct CSS variable.
        this.updateCurrentCategoryColor("--color-category-home");
        //Set the navigation to the correct state.
        nav.setNavigationState(navState.User)
        //Load the login-content into memory..
        this.view = $(data);

        //Empty the content-div and add the resulting view to the page.
        $(".content").empty().append(this.view);

        const username = sessionManager.get("username");

        //display random greeting sentence
        const greetingSentence = this.pickRandomGreeting();
        this.view.find("#welkom-text").html(`${greetingSentence} ${username}`);
        this.fitText();

        $(".cards").click(nav.handleClickMenuItem)
        this.fillMotivationalContent(totalPAMGoal, yesterdayDoneProgress);
    }

    exampleProgress() {

        const totalPAMGoal = Math.round(Math.random() * 1000);
        const previousDoneProgress = Math.round(Math.random() * totalPAMGoal);
        const yesterdayDoneProgress = Math.round(Math.random() * (totalPAMGoal - previousDoneProgress))
        const goalProgress = Math.round(Math.random() * (totalPAMGoal - previousDoneProgress - yesterdayDoneProgress))
        this.setTotalGoal(totalPAMGoal)

        this.setProgress('#goal-previous', previousDoneProgress / totalPAMGoal * 100, previousDoneProgress, true)
        this.setProgress('#goal-now', yesterdayDoneProgress / totalPAMGoal * 100, previousDoneProgress + yesterdayDoneProgress, true)
        this.setProgress('#goal-goal', goalProgress / totalPAMGoal * 100, previousDoneProgress + yesterdayDoneProgress + goalProgress, false)

        this.fillMotivationalContent(totalPAMGoal, yesterdayDoneProgress);
    }

    setProgress(element, percentage, displayValue, hideOnLowPercent) {
        const barElement = $(element);
        barElement.css("width", percentage + '%');
        barElement.find('.pam-value').html(displayValue);
        if (hideOnLowPercent)
            barElement.find('.progress-pin-element').toggle(percentage > 5);
    }

    setTotalGoal(value) {
        $('#progress-bar-end').find('.pam-value').html(value);
    }

    fillMotivationalContent(total, current){
        console.log("hey ik ben cool")
        const progresionIndex = this.calculateProgress(total, current);
        $('#progressie-tekst').empty().append(this.virtualContent[progresionIndex]);
    }

    calculateProgress(total, current){
        const progression = Math.floor((current / total)*100);
        if (progression < 10){
            return 0;
        } else if (progression < 50){
            return 1;
        } else if (progression < 80){
            return 2;
        } else if (progression < 100){
            return 3;
        } else {
            return 4;
        }
    }




    pickRandomGreeting() {
        const zinnen = ["Goed je weer te zien", "Goedemiddag", "Hallo"];
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