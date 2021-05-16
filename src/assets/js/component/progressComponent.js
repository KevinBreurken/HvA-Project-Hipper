class ProgressComponent {
    constructor(htmlRoot) {
        this.pamRepository = new PamRepository();
        this.rehabilitatorRepository = new RehabilitatorRepository();

        $.get("src/views/component/progressComponent.html").done((data) => {
            this.htmlRoot = htmlRoot;
            htmlRoot.append(data);
        })
    }

    setProgressBarData(totalPamGoal, currentlyEarnedPam, dailyPamGoal) {
        if(totalPamGoal == null)
            this.htmlRoot.find(".pad-progress-container").hide();

        //Legend
        this.htmlRoot.find(".legend-earned").html(`${currentlyEarnedPam} Eerder behaalde PAM punten`);
        this.htmlRoot.find(".legend-goal").html(`${dailyPamGoal} PAM punten doel voor vandaag`);
        if(totalPamGoal != null)
            this.htmlRoot.find(".legend-total").html(`${totalPamGoal} PAM punten als totaal doel`);
        else
            this.htmlRoot.find(".total-li").hide();
        //Bar
        this.htmlRoot.find('.pam-value').html(totalPamGoal);
        this.setProgress('#goal-previous', 0, 0, true)
        this.setProgress('#goal-now', currentlyEarnedPam / totalPamGoal * 100, currentlyEarnedPam, true)
        this.setProgress('#goal-goal', dailyPamGoal / totalPamGoal * 100, currentlyEarnedPam + dailyPamGoal, false)
    }

    setProgress(element, percentage, displayValue, hideOnLowPercent) {
        const barElement = this.htmlRoot.find(element);
        barElement.css("width", percentage + '%');
        if (hideOnLowPercent)
            barElement.find('.progress-pin-element').toggle(percentage > 5);
    }

    setAppointmentText(appointmentDate) {
        const dateDisplayText = appointmentDate.getDate() + '/' + (appointmentDate.getMonth() + 1) + '/' + appointmentDate.getFullYear();
        const dateExpired = (appointmentDate < new Date());
        const preText = dateExpired ? "Laatste afspraak was op: " : "Volgende afspraak is op: ";
        if(dateExpired)
            this.htmlRoot.find(".goal-li").hide();
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
        const totalPamGoal = await this.retrieveTotalPamGoal(userId);
        const currentlyEarnedPam = await this.retrieveEarnedPam(userId);
        const appointmentDate = await this.retrieveAppointmentDate(userId);
        const dailyPamGoal = await this.calculateDailyPamGoal(totalPamGoal - currentlyEarnedPam,appointmentDate);

        return {"total": totalPamGoal, "current": currentlyEarnedPam, "daily": dailyPamGoal, "date": appointmentDate};
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
}