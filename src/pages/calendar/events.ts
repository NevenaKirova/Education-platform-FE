const events = [
  { title: 'All Day Event', start: getDate('YEAR-MONTH-01') },
  {
    title: 'Rendezvous',
    start: getDate('YEAR-MONTH-07'),
    end: getDate('YEAR-MONTH-10'),
  },
  {
    title: 'Dontiste',
    start: 'YEAR-MONTH-17',
    end: getDate('YEAR-MONTH-19'),
  },
  {
    title: 'Consultation',
    start: getDate('YEAR-MONTH-18T10:30:00+00:00'),
    end: getDate('YEAR-MONTH-18T12:30:00+00:00'),
  },
  { title: 'Visit', start: getDate('YEAR-MONTH-18T12:00:00+00:00') },
  { title: 'maladie', start: getDate('YEAR-MONTH-19T07:00:00+00:00') },
  { title: 'Meeting', start: getDate('YEAR-MONTH-18T14:30:00+00:00') },
  { title: 'controlle', start: getDate('YEAR-MONTH-18T17:30:00+00:00') },
  { title: 'finish', start: getDate('YEAR-MONTH-18T20:00:00+00:00') },
];

function getDate(dayString) {
  const today = new Date();
  const year = today.getFullYear().toString();
  let month = (today.getMonth() + 1).toString();

  if (month.length === 1) {
    month = '0' + month;
  }

  return dayString.replace('YEAR', year).replace('MONTH', month);
}

export default events;
