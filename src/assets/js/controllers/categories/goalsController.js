/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */
class GoalsController extends CategoryController {
    username = sessionManager.get("username");


    virtualContent = [ "Welkom " + this.username + " Je bent begonnen" ,
         "Hi " + this.username + " Je bent goed op weg",
                        "hey " + this.username + " Je bent er bijna",
        "hey " + this.username + " Je zet de laatste puntje op de i"];
    titlesMotivational = ["De eerste stap", "Een goed begin", "Einde is in zicht", "De nieuwe jij"];
    motvivationalContent = ["Het kan misschien wat intimiderend zijn, maar de eerste stappen zijn altijd het lastigst. Hoewel er nog genoeg te doen staat komt de voortgang vanzelf. Probeer jezelf te focussen op de eerste stappen, het zullen er vanzelf meer worden.",
        "Je hebt al een hele goede start gemaakt naar een gezonde heup. Probeer dit vol te houden, vind vrienden en familie om je te helpen. Je staat er niet alleen voor. Uiteidelijk komt deze balk helemaal naar het einde.",
        "Je bent er bijna! Kijk terug op hoe het in het begin ging, en bewonder de vooruitgang die je al hebt gemaakt. Binnenkort zal je weer door het leven kunnen huppelen, alleen de laatste meters nog.",
        "De laatste stappen en je hebt je doel behaald. Je mag trots zijn op jezelf. Ga met iemand een rondje fietsen, of maak een leuke wandeling. Dat heb je na deze revalidatie zeker wel verdient."];

    constructor() {
        super();
        this.loadView("views/goals.html");

    }

    //Called when the login.html has been loaded.
    setup(data) {
        //Set the navigation to the correct state.
        nav.setNavigationState(navState.User)
        //Load the login-content into memory.
        this.view = $(data);

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.view);
        this.exampleProgress();
        window.onresize = function (event) {
            adjustProgressbarOnScreenResize();
        }

        adjustProgressbarOnScreenResize();
        //Set the navigation color to the correct CSS variable.
        this.updateCurrentCategoryColor("--color-category-goals");
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
        const progresionIndex = this.calculateProgress(total, current);
        $('#progressie-tekst').empty().append(this.virtualContent[progresionIndex]);
        $('#motivational-title').empty().append(this.titlesMotivational[progresionIndex]);
        $('#motivational-description').empty().append(this.motvivationalContent[progresionIndex]);
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
}

/**
 *  Called by onresize to change the labels on the progressbar.
 */
function adjustProgressbarOnScreenResize() {
    hideElementIfDistance('#goal-previous', '#goal-now');
    hideElementIfDistance('#goal-now', '#goal-goal');
    hideElementIfDistance('#goal-goal', '#progress-bar-end');
}

/**
 * Determines when an element needs to be hidden by calculating the difference between two elements.
 */
function hideElementIfDistance(toHideId, compareId) {
    const rootTextElement = $(toHideId).find('.progress-pin-text');
    const compareElement = $(compareId).find('.progress-pin-text');
    const distance = (compareElement.offset().left - rootTextElement.offset().left);

    $(rootTextElement).css("visibility", distance < 70 ? "hidden" : "visible");
    $(toHideId).find('.pam-label').css("visibility", distance < 70 ? "hidden" : "visible");
    $(toHideId).find('.progress-pin-element').css("visibility", distance < 40 ? "hidden" : "visible");
}