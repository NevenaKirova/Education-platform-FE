const eventsS = [
        {
            "title": "Biologiq za naprednali",
            "start": "2024-01-23T08:00:00",
            "end": "2024-01-23T08:30:00",
            "className": "hasStudents"
        },
        {
            "title": "Biologiq za naprednali",
            "start": "2024-02-15T11:00:00",
            "end": "2024-02-15T11:30:00",
            "className": "hasStudents"
        },
        {
            "title": "Biologiq za naprednali",
            "start": "2024-02-16T12:00:00",
            "end": "2024-02-16T12:30:00",
            "className": "hasStudents"
        },
        {
            "title": "Kurs po Matematika ",
            "start": "2024-01-27T08:00:00",
            "end": "2024-01-27T09:00:00",
            "className": "hasStudents"
        },
        {
            "title": "Veche ne e chernova",
            "start": "2024-01-31T08:00:00",
            "end": "2024-01-31T08:30:00",
            "className": "hasStudents"
        },

]

function getDate(dayString) {
    const today = new Date();
    const year = today.getFullYear().toString();
    let month = (today.getMonth() + 1).toString();

    if (month.length === 1) {
        month = '0' + month;
    }

    return dayString.replace('YEAR', year).replace('MONTH', month);
}

export default eventsS;
