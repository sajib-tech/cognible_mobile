export default {
    process(err) {
        let errors = JSON.parse(JSON.stringify(err));
        let stringArr = errors.graphQLErrors.map((error) => {
            return error.message;
        });

        if (stringArr.length != 0) {
            return stringArr.join("\n");
        } else {
            let string2Arr = errors.networkError.result.errors.map((error) => {
                return error.message;
            });
            if (string2Arr.length != 0) {
                return string2Arr.join("\n");
            } else {
                return "Cannot Process Data";
            }
        }
    }
};