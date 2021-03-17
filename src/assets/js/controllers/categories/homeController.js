/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */
class HomeController extends CategoryController {

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