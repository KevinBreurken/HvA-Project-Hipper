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
        this.setProgress('#goal-previous', Math.random() * 100, 30, true)
        this.setProgress('#goal-now', Math.random() * 100, 30, false)
        this.setProgress('#goal-goal', Math.random() * 100, 30, true)
        window.onresize = function (event) {
            adjustProgressbarOnScreenResize();
        }

        adjustProgressbarOnScreenResize();
        //Set the navigation color to the correct CSS variable.
        this.updateCurrentCategoryColor("--color-category-goals");
    }

    setProgress(element, percentage, displayValue, hideOnLowPercent) {
        const barElement = $(element);
        const pinElement = barElement.find('.progress-pin-element');
        barElement.css("width", percentage + '%');
        pinElement.find('.pam-value').html(displayValue);
        if (hideOnLowPercent)
            barElement.find('.progress-pin-element').toggle(percentage > 5);
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
    $(toHideId).find('.progress-pin-element').css("visibility", distance < 35 ? "hidden" : "visible");
}