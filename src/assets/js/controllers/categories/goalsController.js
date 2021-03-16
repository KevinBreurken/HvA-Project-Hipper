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
        this.setPreviousProgress(Math.random() * 100);
        this.setGoalProgress(Math.random() * 100);
        this.setNowProgress(Math.random() * 100);
        window.onresize = function (event) {
            adjustProgressbarOnScreenResize();
        }

        adjustProgressbarOnScreenResize();
        //Set the navigation color to the correct CSS variable.
        this.updateCurrentCategoryColor("--color-category-goals");
    }

    setPreviousProgress(percentage) {
        $('#progress-text-previous').toggle(percentage > 5);
        $('#goal-previous').css("width", percentage + '%');
    }

    setNowProgress(percentage) {
        $('#goal-now').css("width", percentage + '%');
    }

    setGoalProgress(percentage) {
        $('#progress-text-goal').toggle(percentage > 5);
        $('#goal-goal').css("width", percentage + '%');
    }

}

/**
 *  Called by onresize to change the labels on the progressbar.
 */
function adjustProgressbarOnScreenResize() {
    hideElementIfDistance('progress-text-previous', 'progress-text-now');
    hideElementIfDistance('progress-text-now', 'progress-text-goal');
    hideElementIfDistance('progress-text-goal', 'progress-bar-end');
}

/**
 * Determines when an element needs to be hidden by calculating the difference between two elements.
 */
function hideElementIfDistance(toHideId, compareId) {
    const rootTextElement = document.getElementById(toHideId).getElementsByClassName('progress-pin-text')[0];
    const rootBound = rootTextElement.getBoundingClientRect();
    const compareBound = document.getElementById(compareId)
        .getElementsByClassName('progress-pin-text')[0].getBoundingClientRect();

    const distance = (compareBound.x - rootBound.x)
    $(rootTextElement).css("visibility", distance < 70 ? "hidden" : "visible");
    $(document.getElementById(toHideId)
        .getElementsByClassName('pam-label')[0]).css("visibility", distance < 70 ? "hidden" : "visible");
    $(document.getElementById(toHideId)).css("visibility", distance < 40 ? "hidden" : "visible");
}