var course1 = new Course("A",1);
var course2 = new Course("A",4);
var course3 = new Course("B",2);
var course4 = new Course("B",4);
var course5 = new Course("C",1);
var course6 = new Course("C",3);
var course7 = new Course("D",4);
var course8 = new Course("E",2);
var course9 = new Course("E",3);
var course10 = new Course("F",2);
var course11 = new Course("F",3);
var course12 = new Course("F",4);
var course13 = new Course("G",1);
var course14 = new Course("G",2);

var debug = true;

//All the available courses
var courses = [course1,course2,course3,course4,course5,course6,course7,course8,course9,course10,course11,course12,course13,course14];

//Student schedule
const currentSchedule = [course5,course8,course11,course2];

function changeSchedule(wantedId,unwantedId,schedule) {

    var solutions = [];

    //Look for the period the unwanted class is in
    let emptyPeriod;

    for (let i=0; i<currentSchedule.length; i++) {
        if (currentSchedule[i].getId() == unwantedId) {
            emptyPeriod = i+1;
            break;
        }

        emptyPeriod = -1;
    }

    if (emptyPeriod != -1) {

        let periods = allPeriods(wantedId);

        for (let i=0; i<periods.length; i++) {
            let taken = [periods[i]];

            let altSchedule = schedule.slice();

            if (debug) {
                console.log("***************************************");
                console.log(wantedId + " is at period " + periods[i]);
                console.log("_______________________________________");
            }

            replaceCourse(periods[i],taken,emptyPeriod,wantedId,unwantedId,solutions,schedule,altSchedule);
        }
    } else {
        console.log("Error, unwantedId is not found in current schedule")
    }
}

function replaceCourse(period,taken,emptyPeriod,wantedId,unwantedId,solutions,schedule,altSchedule) {
    let replacedCourse = checkPeriod(period);

    if (replacedCourse.id == unwantedId) {
        if (debug) {
            console.log("A solution is found");
        }

        let wantedCourse = findCourse(wantedId,emptyPeriod);

        altSchedule[emptyPeriod-1] = wantedCourse;

        solutions.push(altSchedule);

    } else {
        let altPeriods = allPeriods(replacedCourse.getId()); 

        if (debug) {
            console.log("Since " + replacedCourse.getId() + " is at period " + period + ", they are being replaced")
        }

        removeSimilarity(altPeriods,taken);

        if (altPeriods.length == 0) {
            if (debug) {
                console.log("Dead end is reached");
            }
        } else {
            for (let i=0; i<altPeriods.length; i++) {
                if (altPeriods[i] == emptyPeriod) {
                    if(debug) {
                        console.log("F is now at period " + emptyPeriod)
                        console.log("A solution is found");
                    }

                    
                    altSchedule[emptyPeriod-1] = replacedCourse;
            
                    solutions.push(altSchedule);

                } else {
                    let currentTaken = taken.slice();

                    currentTaken.push(altPeriods[i]);

                    if (debug) {
                        console.log(replacedCourse.getId() + " is now at period " + altPeriods[i]);
                    }

                    replaceCourse(altPeriods[i],currentTaken,emptyPeriod,wantedId,unwantedId,solutions,schedule,altSchedule);
                }
            }
        }
    }
}

//Swap two objects
function swap(objectA, objectB) {
    console.log(objectA.getId() + " " + objectB.getId())

    let temp = objectA;
    objectA = objectB;
    objectB = temp;

    console.log(objectA.getId() + " " + objectB.getId())
}

//Returns the empty period
function checkEmptyPeriod(unwantedId) {
    let emptyPeriod;

    for (let i=0; i<currentSchedule.length; i++) {
        if (currentSchedule[i].getId() == unwantedId) {
            emptyPeriod = i+1;
            break;
        }

        emptyPeriod = -1;
    }

    return emptyPeriod;
}

//Returns the course at the specified period (in the schedule)
function checkPeriod(period) {
    return currentSchedule[period-1];
}

//Returns all periods that course has
function allPeriods(courseId) {
    let periods = [];

    for (let i=0; i<courses.length; i++) {
        if (courses[i].getId() == courseId) {
            periods.push(courses[i].getPeriod());
        }
    }

    return periods;
}

//Find course from id and period
function findCourse(id,period) {
    let wantedCourse;

    for (let i=0; i<courses.length; i++) {
        if (courses[i].getId() == id && courses[i].getPeriod() == period) {
            wantedCourse = courses[i];
            break;
        }
    }

    return wantedCourse;
}

//Removes any element at original that matches any element in reference
function removeSimilarity(original,reference) {
    for (let i=0; i<reference.length; i++) {
        for (let j=0; j<original.length; j++) {
            if (original[j] == reference[i]) {
                original.splice(j,1);
            }
        }
    }
}

//Print out current schedule
for (let i=0; i<currentSchedule.length; i++) {
    if (i == 0) {
        console.log("Current Schedule:");
        console.log("Period  Course");
    }
    console.log((i+1) + "       " + currentSchedule[i].getId());
}

changeSchedule("B","A",currentSchedule);