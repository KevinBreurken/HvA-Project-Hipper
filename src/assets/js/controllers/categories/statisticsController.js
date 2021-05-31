/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */
let statsChart;
let momentArray = [];
let weekData = [0,0,0,0,0,0,0];
let pamDates;

class StatisticsController extends CategoryController {
    constructor() {
        super();
        this.loadView("views/statistics.html");
        this.pamRepository = new PamRepository();
        this.userRepository = new UserRepository();
    }

    //Called when the login.html has been loaded.
    setup(data) {

        //Set the navigation color to the correct CSS variable.
        this.updateCurrentCategoryColor("--color-category-statistics");
        //Set the navigation to the correct state.
        nav.setNavigationState(navState.User)

        //Load the login-content into memory.
        this.view = $(data);

        // this.pamRepository.getPam(sessionManager.get(""))
        //Empty the content-div and add the resulting view to the page.
        $(".content").empty().append(this.view);

        this.getPamDates().then((e) => {
            pamDates = e;
        });

        //When clicked the advance stats button, show stats
        $(document).on("click", ".advanced-stats", () => this.changeScreen(true));
        $(document).on("click", ".normal-stats", () => this.changeScreen(false));

        // When the datepicker changes value
        $(document).on("change", ".datepicker-stats", () => this.updateChart());

        // The left and right arrow on click
        $(document).on("click", ".fa-arrow-left", () => {
            this.changeWeekArrows("left");
        });

        $(document).on("click", ".fa-arrow-right", () => {
            this.changeWeekArrows("right");
        });
    }

    /**
     * Change the screens from basic stats to advanced chart
     * @boolean advanced do you want to go to the advanced chart or not
     */
    changeScreen(advanced) {
        if (advanced === true) {
            $(".content").load("views/advanced_statistics.html", () => {
                this.makeStats();
                $(".datepicker-stats").val(moment().format("YYYY-MM-DD"));
            });
        } else {
            $(".content").load("views/statistics.html", () => {

            });
        }
    }

    /**
     * Get pam dates
     * @returns {Promise<void>}
     */
    async getPamDates() {
        return await this.userRepository.getAll(sessionManager.get("userID"));
    }

    /**
     * Uses the arrows on statistic to change the week
     */
    changeWeekArrows(direction) {
        if (direction === "left") {
            let firstVal = moment($(".datepicker-stats").val());
            firstVal = firstVal.subtract("1", "weeks");
            $(".datepicker-stats").val(firstVal.format("YYYY-MM-DD"));
            this.updateChart();
        } else {
            let firstVal = moment($(".datepicker-stats").val());
            firstVal = firstVal.add("1", "weeks");
            $(".datepicker-stats").val(firstVal.format("YYYY-MM-DD"));
            this.updateChart();
        }
    }
    /**
     * Update the stats chart
     */
    updateChart() {
        let chosenWeek = moment($(".datepicker-stats").val());

        // Update the weekdata back to all 0, because if there isn't any numbers to replace it with, the array is also updated.
        weekData = [0,0,0,0,0,0,0];

        //Check for each moment if theyre in the same week and year, and then replace them
        momentArray.forEach((moment) => {
            // So if theyre in the same week and same year, use them
            if (moment.date.isoWeek() === chosenWeek.isoWeek() && moment.date.format('YYYY') === chosenWeek.format('YYYY')) {
                let dateIso = moment.date.isoWeekday();
                weekData[dateIso - 1] = moment.pam_score;
            }
        })
        statsChart.data.datasets[0].data = weekData;
        statsChart.update();
    }
    
    /**
     * Make the stats chart
     * @returns {Promise<void>}
     */
    async makeStats() {
        // Destroy the chart first if exists NOT DONE RICK
        if (statsChart) {
            statsChart.destroy();
        }

        // Convert dates into moment objects
        momentArray = pamDates.map((number) => {
            number.date = moment(number.date);
            return number;
        });

        // Then sort the moment array into the right dates
        momentArray = momentArray.sort((a,b) => {
            return a.date.format('YYYYMMDD') - b.date.format('YYYYMMDD');
        })

        // Create an array with dates because the javascript get day method only gives you back a number.
        let days = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
        let pamScores = [];

        // Where the date date is
        let start = 0;

        for (let i = 0; i < momentArray.length; i++) {
            pamScores.push(momentArray[i]["pam_score"]);
            momentArray[i]["week"] = momentArray[i]["date"].isoWeek();

            // Set the dates
            let today = moment();

            // console.log(today, date, pamDates[i]["date"]);
            if (today.isSame(momentArray[i]["date"], 'day')) {
                start = i;
            }
        }

        let startOfWeek;
        if (momentArray.length > 0) {
            let weekday = momentArray[start]["date"].isoWeekday();
            startOfWeek = moment().subtract((weekday - 1), "days").isoWeek();
        }

        // Check if they are from this week, and if they are, replace them in the
        momentArray.forEach((date) => {
            if (date.week === startOfWeek) {
                let dateIso = date.date.isoWeekday();
                weekData[dateIso - 1] = date.pam_score;
            }
        })
        // Create the context
        let ctx = document.getElementById('stats-chart').getContext('2d');

        //Set the context height, fixed height (might change later)
        ctx.height = 500;

        // Make the graph
        statsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Pamsore',
                    data: weekData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(0,191,243)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 0,191,243)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                maintainAspectRatio: false,
            }
        });
    }

    async getPamData(id) {
        this.retrievePam(id).then((event) => {
            return event;
        });
    }
}

// $(document).on((".datepicker-stats").change(() => {
//     console.log("kek");
// })


