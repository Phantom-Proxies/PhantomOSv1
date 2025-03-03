class filePathHelper {
    constructor(URL) {
        this.url = URL;
        //this.relativeURL = isRelative;
        this.convertedURL = null;
    }

    relativeToAbsolute() {
        let currentURL = window.location.origin + window.location.pathname;
        this.convertedURL = currentURL.replace(window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1), this.url);
        return this.convertedURL;
    }
}