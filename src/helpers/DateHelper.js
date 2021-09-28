import store from "../redux/store";
import moment from 'moment';

const DateHelper = {
    getCurrentWeekDates: function () {
        let dates = [];
        let days = ["S", "M", "T", "W", "T", "F", "S"]
        for (var i = 6; i > 0; i--) {
            var date = new Date();
            var last = new Date(date.getTime() - (i * 24 * 60 * 60 * 1000));
            var day = last.getDay();
            let dateObject = {
                isToday: false,
                year: last.getFullYear(),
                month: ("0" + (last.getMonth() + 1)).slice(-2),
                date: ("0" + (last.getDate())).slice(-2),
                isSelected: false,
                dayName: days[day]
            };
            dates.push(dateObject);
        }
        var today = new Date();
        let todayDateObject = {
            isToday: true,
            year: today.getFullYear(),
            month: ("0" + (today.getMonth() + 1)).slice(-2),
            date: ("0" + (today.getDate())).slice(-2),
            isSelected: true,
            dayName: days[today.getDay()]
        };
        dates.push(todayDateObject);
        // console.log(dates.length)
        return dates;
    },
    getCurrentWeekDates1: function () {
        let curr = new Date;
        let todayDate = curr.getDate();
        // console.log("Today Date:"+curr.getDate());
        let dates = [];
        for (let i = 0; i <= 6; i++) {
            let first = curr.getDate() - curr.getDay() + i;
            // let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
            let d = new Date(curr.setDate(first));
            let isTodayDate = (todayDate == d.getDate()) ? true : false;
            let dateObject = {
                isToday: isTodayDate,
                year: d.getFullYear(),
                month: ("0" + (d.getMonth() + 1)).slice(-2),
                date: ("0" + (d.getDate())).slice(-2),
                isSelected: isTodayDate
            };
            dates.push(dateObject);
        }
        return dates;
    },
    getTodayDate: function () {
        let date = new Date;
        let y = date.getFullYear();
        let m = ("0" + (date.getMonth() + 1)).slice(-2);
        let d = ("0" + (date.getDate())).slice(-2);
        return y + "-" + m + "-" + d;
    },
    getDateFromDatetime: function (input) {
        let date = new Date(input);
        // console.log(date);
        let y = date.getFullYear();
        let m = ("0" + (date.getMonth() + 1)).slice(-2);
        let d = ("0" + (date.getDate())).slice(-2);
        //  console.log("----------"+y+"-"+m+"-"+d);
        return y + "-" + m + "-" + d;
        // let splitted = input.toString().split("T");
        // return splitted[0];
    },
    getTimeFromDatetime: function (input) {
        let date = new Date(input);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    },
    getDateFromFullDate: function (input) {
        let date = new Date(input);
        return ("0" + (date.getDate())).slice(-2);
    },

    isTokenExpired: function (timeStamp) {
        // console.log(timeStamp);
        let tokenExpiryTime = new Date(timeStamp * 1000)
        let currentTime = new Date();
        // console.log(tokenExpiryTime + "=======" + currentTime);
        if (tokenExpiryTime < currentTime) {
            console.log("EXPIRED");
            return true;
        }
        return false;
    },
    convertSecondsToMinutes: function (timeInSeconds) {
        let minutes = Math.floor(timeInSeconds / 60);
        let seconds = timeInSeconds - minutes * 60;
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return minutes + " : " + seconds;
    },

    convertSecondToClock(seconds) {
        seconds = parseInt("" + seconds);
        let sec = this.pad(seconds % 60);
        let minutesRaw = parseInt(seconds / 60);
        let min = this.pad(minutesRaw);
        if (minutesRaw >= 60) {
            let hour = this.pad(parseInt(min / 60));
            min = this.pad(min % 60);
            return hour + ":" + min + ":" + sec;
        } else {
            return min + ":" + sec;
        }
    },
    convertClockToSecond(clocks) {
        let arr = clocks.split(":");
        if (arr.length == 3) {
            return parseInt(arr[0] * 3600) + parseInt(arr[1] * 60) + parseInt(arr[2]);
        } else {
            return parseInt(parseInt(arr[0] * 60) + parseInt(arr[1]));
        }
    },

    pad(val) {
        let valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    },

    caluculateTimeInSeconds(time) {
        let timeArray = time.split(":");
        let minutes = parseInt(timeArray[0]);
        let seconds = parseInt(timeArray[1]);
        return (minutes * 60) + seconds;
    },

    getCurrentTimezone() {
        return store.getState().timezone;
    },

    getAge(dateOfBirth) {
        var a = moment();
        var b = moment(dateOfBirth);

        var diffDuration = moment.duration(a.diff(b));
        return diffDuration.years() + 'y ' + diffDuration.months() + 'm';
    }
}

export default DateHelper;