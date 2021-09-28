export default {
    getImage(path) {
        let baseURL = "https://application.cogniable.us/media/";
        let defaultImage = baseURL + "images/user.jpeg";
        if (path != "") {
            defaultImage = baseURL + path;
        }

        return defaultImage;
    }
}
