/**
 * Base class for every category controller.
 *
 * @author Kevin Breurken
 */
class CategoryController {

    constructor() {
        if (new.target === CategoryController)
            throw new TypeError("Cannot construct CategoryController instances directly");
    }

    /**
     * Changes the CSS current category color to the given CSS variable name.
     * @param cssVariableName namve of the css variable e.g. --color-category-default.
     */
    updateCurrentCategoryColor(cssVariableName) {
        let catColor = getComputedStyle(document.documentElement).getPropertyValue(cssVariableName);
        document.body.style.setProperty('--color-category-current', catColor);
    }

    loadView(path) {
        $.get(path)
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    setup(data) {
    }

    remove() {
    }

    //Called when the view failed to load.
    error() {
        $(".content").html(`Failed to load ${this.constructor.name} view!`);
    }
}

async function saveImageUpload(input, htmlHook) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(htmlHook)
                .attr('src', e.target.result)

            return networkManager
                .doRequest(`/user/uploader`, {"data": e.target.result}, "POST");
        };
        return reader.readAsDataURL(input.files[0]);
    }
}