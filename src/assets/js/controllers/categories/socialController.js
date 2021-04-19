/**
 * Controller responsible for all events in view and setting data
 *
 * @author Pim Meijer
 */
class SocialController extends CategoryController {

    constructor() {
        super();
        this.loadView("views/social.html");
        this.socialRepository = new SocialRepository();

    }

    //Called when the login.html has been loaded.
    setup(data) {
        //Set the navigation color to the correct CSS variable.
        this.updateCurrentCategoryColor("--color-category-social");
        //Set the navigation to the correct state.
        nav.setNavigationState(navState.User)
        //Load the login-content into memory.
        this.view = $(data);

        //Empty the content-div and add the resulting view to the page.
        $(".content").empty().append(this.view);
    }
    async retrieveSocial() {
        try {
            //await keyword 'stops' code until data is returned - can only be used in async function
            // const roomData = await this.pamRepository.getPam(sessionManager.get("userID"));
            const roomData = await this.socialRepository.getSocialMessage(sessionManager.get("userID"))
        } catch (e) {
            console.log("error while fetching pam data.", e);
        }
    }
}