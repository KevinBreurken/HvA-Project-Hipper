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
        $(".content").empty();
        window.onresize = function (event) {
            adjustProgressbarOnScreenResize();
        }

        //Set the navigation color to the correct CSS variable.
        this.updateCurrentCategoryColor("--color-category-goals");
        const pamdata = await this.retrieveProgressData();
        //Empty the content-div and add the resulting view to the page
        $(".content").append(this.view);
        this.setProgressBarData(pamdata['total'],pamdata['current'], pamdata['daily']);
    }

    /**
     * Function that calls multiple requests to populate the progress bar.
     * @returns {Promise<void>}
     */
    async retrieveProgressData() {
        const dailyPamGoal = await this.retrieveDailyPamGoal();
        const totalPamGoal = await this.retrieveTotalPamGoal();
        const currentlyEarnedPam = await this.retrieveEarnedPam();

        return {"total": totalPamGoal, "current": currentlyEarnedPam, "daily": dailyPamGoal};
    }

    remove() {
        super.remove();
        window.onresize = null;
    }

    async retrievePam() {
        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            return await this.pamRepository.getPam(sessionManager.get("userID"));
        } catch (e) {
            console.log("error while fetching pam data.", e);
        }
    }

    async retrieveEarnedPam() {
        const allPam = await this.retrievePam();
        let totalScore = 0;
        //Loop through every PAM score.
        for (let i = 0; i < allPam.length; i++) {
            //Loop through every digit of PAM score.
            for (let j = 0; j < allPam[i]['quarterly_score'].length; j++) {
                totalScore += parseInt(allPam[i]['quarterly_score'][j]);
            }
        }
        return totalScore;
    }

    async retrieveDailyPamGoal() {
        try {
            const dailyGoal = await this.rehabilitatorRepository.getPamDailyGoal(sessionManager.get("userID"));
            return dailyGoal[0]['pam_goal_daily'];
        } catch (e) {
            console.log("error while fetching daily pam goal.", e);
            return 0;
        }
    }

    async retrieveTotalPamGoal() {
        try {
            const totalGoal = await this.rehabilitatorRepository.getTotalGoal(sessionManager.get("userID"));
            return totalGoal[0]['pam_goal_total'];
        } catch (e) {
            console.log("error while fetching daily pam goal.", e);
            return 0;
        }
    }

    setProgressBarData(totalPamGoal,currentlyEarnedPam, dailyPamGoal) {
        const yesterdayDoneProgress = 20;
        this.setTotalGoal(totalPamGoal)

        $('#yesterday-text').html(`Gisteren heeft u ${yesterdayDoneProgress} PAM punten gehaald`);
        $('#today-text').html(`U bent al aardig onderweg! Voor vandaag heeft u een doel staan van  ${dailyPamGoal} PAM punten.
                kijk of u een nieuwe wandelroute of doel kan aannemen om uwzelf uit te dagen!`);
        this.setProgress('#goal-previous', 0, 0, true)
        this.setProgress('#goal-now', currentlyEarnedPam / totalPamGoal * 100, currentlyEarnedPam, true)
        this.setProgress('#goal-goal', dailyPamGoal / totalPamGoal * 100, currentlyEarnedPam + dailyPamGoal, false)
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
