/**
 * Component used for handling and maintaining a progress bar UI element.
 */
class ProgressComponent {

    constructor(htmlRoot) {
        this.pamRepository = new PamRepository();
        this.rehabilitatorRepository = new RehabilitatorRepository();

        this.totalPamGoal = 0;
        this.currentlyEarnedPam = 0;
        this.appointmentDate = null;

        $.get("views/component/progressComponent.html").done((data) => {
            this.htmlRoot = htmlRoot;
            htmlRoot.append(data);
        });
    }

    /**
     * Displays the stored changes to the DOM.
     * @returns {Promise<void>}
     */
    async repaintProgressBar() {

        this.dailyPamGoal = await this.calculateDailyPamGoal(this.totalPamGoal - this.currentlyEarnedPam, this.appointmentDate);
        this.dailyPamGoal = this.dailyPamGoal.toFixed(1);

        //Hide if there's no total goal.
        this.htmlRoot.find(".pad-progress-container").toggle(this.totalPamGoal !== null);

        //Update legend
        this.htmlRoot.find(".legend-earned").html(`${this.currentlyEarnedPam} Eerder behaalde PAM punten`);
        this.htmlRoot.find(".legend-goal").html(`${dailyPamGoal} PAM punten doel voor vandaag`);
        this.htmlRoot.find(".legend-total").html(`${this.totalPamGoal} PAM punten als totaal doel`);

        //Update bar
        this.htmlRoot.find('.pam-value').html(this.totalPamGoal);
        this.setProgressBarElement('#goal-previous', 0, 0, true)
        this.setProgressBarElement('#goal-now', this.currentlyEarnedPam / this.totalPamGoal * 100, this.currentlyEarnedPam, true)
        this.setProgressBarElement('#goal-goal', this.dailyPamGoal / this.totalPamGoal * 100, this.currentlyEarnedPam + this.dailyPamGoal, false)
        this.updateAppointmentText();
    }

    /**
     * Changes the appointment display text to the desired text.
     */
    updateAppointmentText() {
        const dateDisplayText = this.appointmentDate.getDate() + '/' + (this.appointmentDate.getMonth() + 1) + '/' + this.appointmentDate.getFullYear();
        const dateExpired = (this.appointmentDate < new Date());
        const preText = dateExpired ? "Laatste afspraak was op: " : "Volgende afspraak is op: ";

        this.htmlRoot.find(".goal-li").toggle(!dateExpired); //List item is hidden when appointment is in the past.
        this.htmlRoot.find(".appointment-text").html(`<b>${preText}${dateDisplayText}</b>`);
    }


    async calculateDailyPamGoal(leftToDoPam, appointment) {
        try {
            const diffInMs = new Date(appointment) - new Date();
            const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

            return leftToDoPam / diffInDays;
        } catch (e) {
            console.log("error while calculating daily pam goal.", e);
            return 0;
        }
    }

    /**
     * Function that calls multiple requests to populate the progress bar.
     * @returns {Promise<void>}
     */
    async retrieveProgressData(userId) {
        this.totalPamGoal = await this.retrieveTotalPamGoal(userId);
        this.currentlyEarnedPam = await this.retrieveEarnedPam(userId);
        this.appointmentDate = await this.retrieveAppointmentDate(userId);

        let dailyPamGoal = await this.calculateDailyPamGoal(this.totalPamGoal - this.currentlyEarnedPam,this.appointmentDate);
        dailyPamGoal = dailyPamGoal.toFixed(1);

        return {"total": this.totalPamGoal, "current": this.currentlyEarnedPam, "daily": dailyPamGoal, "date": this.appointmentDate};
    }

    setProgressBarElement(element, percentage, displayValue, hideOnLowPercent) {
        const barElement = this.htmlRoot.find(element);
        barElement.css("width", percentage + '%');
        if (hideOnLowPercent)
            barElement.find('.progress-pin-element').toggle(percentage > 5);
    }

    async retrievePam(userId) {
        try {
            return await this.pamRepository.getPam(userId);
        } catch (e) {
            console.log("error while fetching pam data.", e);
        }
    }

    async retrieveEarnedPam(userId) {
        const allPam = await this.retrievePam(userId);
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

    async retrieveTotalPamGoal(userId) {
        try {
            const totalGoal = await this.rehabilitatorRepository.getTotalGoal(userId);
            return totalGoal[0]['pam_goal_total'];
        } catch (e) {
            console.log("error while fetching total pam goal.", e);
            this.htmlRoot.find(".total-li").hide()
            return 0;
        }
    }

    async retrieveAppointmentDate(userId) {
        try {
            const appDate = await this.rehabilitatorRepository.getAppointmentDate(userId);
            const appointmentDate = appDate[0]['appointment_date'];
            return new Date(appointmentDate);
        } catch (e) {
            console.log("error while fetching appointment date.", e);
            return 0;
        }
    }

    getCalculatedDailyPamGoal(){
        return this.dailyPamGoal;
    }

    setTotalGoal(value) {
        this.totalPamGoal = value;
    }

    setAppointmentDate(value) {
        this.appointmentDate = value;
    }

    setAssignedID(id) {
        this.assignedID = id;
    }

    getAssignedID() {
        return this.assignedID;
    }
}
