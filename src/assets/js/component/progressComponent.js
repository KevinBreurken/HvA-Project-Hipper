class ProgressComponent {
    constructor(htmlRoot) {
        this.pamRepository = new PamRepository();
        this.rehabilitatorRepository = new RehabilitatorRepository();

        this.totalPamGoal = 0;
        this.currentlyEarnedPam = 0;

        $.get("views/component/progressComponent.html").done((data) => {
            this.htmlRoot = htmlRoot;
            htmlRoot.append(data);
        })
    }

    async repaintProgressBar() {

        let dailyPamGoal = await this.calculateDailyPamGoal(this.totalPamGoal - this.currentlyEarnedPam, this.appointmentDate);
        dailyPamGoal = dailyPamGoal.toFixed(1);

        this.htmlRoot.find(".pad-progress-container").toggle(this.totalPamGoal !== null);

        //Legend
        this.htmlRoot.find(".legend-earned").html(`${this.currentlyEarnedPam} Eerder behaalde PAM punten`);
        this.htmlRoot.find(".legend-goal").html(`${dailyPamGoal} PAM punten doel voor vandaag`);

        this.htmlRoot.find(".total-li").toggle(this.totalPamGoal != null);
        this.htmlRoot.find(".legend-total").html(`${this.totalPamGoal} PAM punten als totaal doel`);
        //Bar
        this.htmlRoot.find('.pam-value').html(this.totalPamGoal);
        this.setProgress('#goal-previous', 0, 0, true)
        this.setProgress('#goal-now', this.currentlyEarnedPam / this.totalPamGoal * 100, this.currentlyEarnedPam, true)
        this.setProgress('#goal-goal', dailyPamGoal / this.totalPamGoal * 100, this.currentlyEarnedPam + dailyPamGoal, false)
        this.setAppointmentText();
    }

    setProgress(element, percentage, displayValue, hideOnLowPercent) {
        const barElement = this.htmlRoot.find(element);
        barElement.css("width", percentage + '%');
        if (hideOnLowPercent)
            barElement.find('.progress-pin-element').toggle(percentage > 5);
    }

    setAppointmentText() {
        const dateDisplayText = this.appointmentDate.getDate() + '/' + (this.appointmentDate.getMonth() + 1) + '/' + this.appointmentDate.getFullYear();
        const dateExpired = (this.appointmentDate < new Date());
        const preText = dateExpired ? "Laatste afspraak was op: " : "Volgende afspraak is op: ";
        this.htmlRoot.find(".goal-li").toggle(!dateExpired)
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
    }

    async retrievePam(userId) {
        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
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
            console.log("error while fetching daily pam goal.", e);
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

    setTotalGoal(value) {
        this.totalPamGoal = value;
    }

    setAppointmentDate(value) {
        this.appointmentDate = value;
    }

    assignID(id) {
        this.assignedID = id;
    }

    getAssignedID() {
        return this.assignedID;
    }
}