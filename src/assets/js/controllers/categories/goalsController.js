/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */
class GoalsController extends CategoryController {
    titlesMotivational = ["De eerste stap", "Een goed begin", "Einde is in zicht", "De nieuwe jij"];
    motvivationalContent = ["Het kan misschien wat intimiderend zijn, maar de eerste stappen zijn altijd het lastigst. Hoewel er nog genoeg te doen staat komt de voortgang vanzelf. Probeer jezelf te focussen op de eerste stappen, het zullen er vanzelf meer worden.",
        "Je hebt al een hele goede start gemaakt naar een gezonde heup. Probeer dit vol te houden, vind vrienden en familie om je te helpen. Je staat er niet alleen voor. Uiteidelijk komt deze balk helemaal naar het einde.",
        "Je bent er bijna! Kijk terug op hoe het in het begin ging, en bewonder de vooruitgang die je al hebt gemaakt. Binnenkort zal je weer door het leven kunnen huppelen, alleen de laatste meters nog.",
        "De laatste stappen en je hebt je doel behaald. Je mag trots zijn op jezelf. Ga met iemand een rondje fietsen, of maak een leuke wandeling. Dat heb je na deze revalidatie zeker wel verdient."];

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

        //Set the navigation color to the correct CSS variable.
        this.updateCurrentCategoryColor("--color-category-goals");
        const pamdata = await this.retrieveProgressData();
        //Empty the content-div and add the resulting view to the page
        $(".content").append(this.view);
        this.loadActivities();
        this.setProgressBarData(pamdata['total'],pamdata['current'], pamdata['daily']);
        this.fillMotivationalContent(pamdata['total'], pamdata['current']);
        $("#pam-goal-today").html(`PAM Doel voor vandaag: ${pamdata['daily']} punten`);
        $("#pam-deadlinegoal-text").html(`<b>Uw volgende afspraak is op: ${pamdata['date']}</b>`);
        $("#pam-dailygoal-text").html(`<b>Om het PAM totaal te bereiken moet u dagelijks ${pamdata['daily']} PAM punten behalen.</b>`);
    }

    /**
     * Function that calls multiple requests to populate the progress bar.
     * @returns {Promise<void>}
     */
    async retrieveProgressData() {
        const dailyPamGoal = await this.retrieveDailyPamGoal();
        const totalPamGoal = await this.retrieveTotalPamGoal();
        const currentlyEarnedPam = await this.retrieveEarnedPam();
        const appointmentDate = await this.retrieveAppointmentDate();

        return {"total": totalPamGoal, "current": currentlyEarnedPam, "daily": dailyPamGoal, "date": appointmentDate};
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
    async retrieveAppointmentDate(){
        try {
            const appDate = await this.rehabilitatorRepository.getAppointmentDate(sessionManager.get("userID"));
            const appointmentDate = appDate[0]['appointment_date'];
            const date = new Date(appointmentDate);
            const finaldate = date.getDate() + '/' +(date.getMonth()+1) + '/' + date.getFullYear();
            return finaldate;
        }catch (e){
            console.log("error while fetching appointment date.", e);
            return 0;
        }
    }

    setProgressBarData(totalPamGoal,currentlyEarnedPam, dailyPamGoal) {
        const yesterdayDoneProgress = 20;
        this.setTotalGoal(totalPamGoal)

        $('#yesterday-text').html(`Gisteren heeft u ${yesterdayDoneProgress} PAM punten gehaald`);
        $('#today-text').html(`U bent al aardig onderweg! Voor vandaag heeft u een doel staan van  ${dailyPamGoal} PAM punten.
                kijk of u een nieuwe wandelroute of doel kan aannemen om uwzelf uit te dagen!`);
        $('#bar-color-total-text').html(`Totaal doel van ${totalPamGoal} PAM punten`);
        $('#bar-color-goal-text').html(`${dailyPamGoal} PAM punten doel voor vandaag`);
        $('#bar-color-yesterday-text').html(`${currentlyEarnedPam} Eerder behaalde PAM punten`);
        this.setProgress('#goal-previous', 0, 0, true)
        this.setProgress('#goal-now', currentlyEarnedPam / totalPamGoal * 100, currentlyEarnedPam, true)
        this.setProgress('#goal-goal', dailyPamGoal / totalPamGoal * 100, currentlyEarnedPam + dailyPamGoal, false)
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

    setProgress(element, percentage, displayValue, hideOnLowPercent) {
        const barElement = $(element);
        barElement.css("width", percentage + '%');
        // barElement.find('.pam-value').html(displayValue);
        if (hideOnLowPercent)
            barElement.find('.progress-pin-element').toggle(percentage > 5);
    }

    setTotalGoal(value) {
        $('#progress-bar-end').find('.pam-value').html(value);
    }

    fillMotivationalContent(total, current){
        const progresionIndex = this.calculateProgress(total, current);
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