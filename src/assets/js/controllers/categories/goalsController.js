/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */
class GoalsController extends CategoryController {

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

        $('#yesterday-text').html(`Gisteren heeft u ${yesterdayDoneProgress} PAM punten gehaald`);
        $('#today-text').html(`U bent al aardig onderweg! Voor vandaag heeft u een doel staan van  ${goalProgress} PAM punten.
                kijk of u een nieuwe wandelroute of doel kan aannemen om uwzelf uit te dagen!`);
        this.setProgress('#goal-previous', previousDoneProgress / totalPAMGoal * 100, previousDoneProgress, true)
        this.setProgress('#goal-now', yesterdayDoneProgress / totalPAMGoal * 100, previousDoneProgress + yesterdayDoneProgress, true)
        this.setProgress('#goal-goal', goalProgress / totalPAMGoal * 100, previousDoneProgress + yesterdayDoneProgress + goalProgress, false)
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