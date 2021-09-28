import store from "../../../redux/store";


export default {
    isCanCreateGroup() {
        return store.getState().user.id == "VXNlclR5cGU6MTk4";
    }
}