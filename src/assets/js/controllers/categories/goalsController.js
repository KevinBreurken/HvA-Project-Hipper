/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */
class GoalsController extends CategoryController {

    constructor() {
        super();
        this.loadView("views/goals.html");
        this.pamRepository = new PamRepository();
        this.rehabilitatorRepository = new RehabilitatorRepository();
    }

    //Called when the login.html has been loaded.
    async setup(data) {
        //Set the navigation to the correct state.
        nav.setNavigationState(navState.User)
        //Load the login-content into memory.
        this.view = $(data);

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.view);
        window.onresize = function (event) {
            adjustProgressbarOnScreenResize();
        }

        //Set the navigation color to the correct CSS variable.
        this.updateCurrentCategoryColor("--color-category-goals");
        this.retrieveProgressData();
        this.loadActivities();
    }

    /**
     * Function that calls multiple requests to populate the progress bar.
     * @returns {Promise<void>}
     */
    async retrieveProgressData() {
        const dailyPamGoal = await this.retrieveDailyPamGoal();
        this.setProgressBarData(dailyPamGoal[0]['pam_goal_daily']);
    }

    remove() {
        super.remove();
        window.onresize = null;
    }

    async retrievePam() {
        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            const roomData = await this.pamRepository.getPam(sessionManager.get("userID"));
        } catch (e) {
            console.log("error while fetching pam data.", e);
        }
    }

    async retrieveDailyPamGoal() {
        try {
            return await this.rehabilitatorRepository.getPamDailyGoal(sessionManager.get("userID"));
        } catch (e) {
            console.log("error while fetching daily pam goal.", e);
            return 0;
        }
    }

    async loadActivities() {
        try {
            const activities = await this.rehabilitatorRepository.getPamActivities(sessionManager.get("userID"));
            const activityContainer = $('#activity-container');
            activityContainer.empty();
            for (let i = 0; i < activities.length; i++) {
                activityContainer.append(this.generateActivityCard(activities[i]));
            }

        } catch (e) {
            console.log("error while fetching activities.", e);
            return 0;
        }
    }

    generateActivityCard(cardData) {
        const pamText = cardData['earnable_pam'] === null ? "" : `<p class="goal-card-subheader">${cardData['earnable_pam']} verwachten PAM punten</p>`;
        return `
        <div class="goal-card-container mx-auto">
            <h5 class="goal-card-header">${cardData['header']}</h5>
            <div class="goal-card-content">
                <div class="mx-auto">
                    <img src="./assets/img/goal-activities/map.svg" alt="website logo" width="45%" class="mx-auto d-block">
                </div>
                <p class="goal-card-subheader">${cardData['subheader']}</p>
                <p>${cardData['content']}</p>
                ${pamText}
            </div>
        </div>`;
    }

    setProgressBarData(dailyPamGoal) {
        const totalPAMGoal = Math.round(Math.random() * 1000);
        const previousDoneProgress = Math.round(Math.random() * totalPAMGoal);
        const yesterdayDoneProgress = Math.round(Math.random() * (totalPAMGoal - previousDoneProgress))
        this.setTotalGoal(totalPAMGoal)

        $('#yesterday-text').html(`Gisteren heeft u ${yesterdayDoneProgress} PAM punten gehaald`);
        $('#today-text').html(`U bent al aardig onderweg! Voor vandaag heeft u een doel staan van  ${dailyPamGoal} PAM punten.
                kijk of u een nieuwe wandelroute of doel kan aannemen om uwzelf uit te dagen!`);
        this.setProgress('#goal-previous', previousDoneProgress / totalPAMGoal * 100, previousDoneProgress, true)
        this.setProgress('#goal-now', yesterdayDoneProgress / totalPAMGoal * 100, previousDoneProgress + yesterdayDoneProgress, true)
        this.setProgress('#goal-goal', dailyPamGoal / totalPAMGoal * 100, previousDoneProgress + yesterdayDoneProgress + dailyPamGoal, false)
        adjustProgressbarOnScreenResize();
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