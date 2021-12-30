const pipe = require("ramda/src/pipe");

const getTodaysDate = () => new Date();

const addDaysToDate = (days) => (date) => {
  const newDate = date.setDate(date.getDate() + days);
  return newDate;
};

const toDateFormat = (date) => new Date(date);

const add5daysToDate = pipe(addDaysToDate(5), toDateFormat);

module.exports = {
  add5daysToDate,
  toDateFormat,
  addDaysToDate,
  getTodaysDate,
};
