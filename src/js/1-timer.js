import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";


import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


iziToast.show({
});

let userSelectedDate = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const pickedDate = selectedDates[0];

    if (pickedDate <= new Date()) {
      iziToast.error({
        title: "Please choose a date in the future",
        position: "topRight",
        messageColor: "#fff",
        titleColor: "#fff",
        backgroundColor: "#ef4040"
      });
      userSelectedDate = null;
      startBtn.disabled = true;
      return;
    }
    userSelectedDate = pickedDate;
  },
};

flatpickr("#datetime-picker", options);

const startBtn = document.querySelector("button[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

startBtn.addEventListener("click", () => {
  if (!userSelectedDate) {
    alert("Please select a valid date first!");
    return;
  }


  if (timerId) clearInterval(timerId);

  timerId = setInterval(() => {
    const diff = userSelectedDate - new Date();

    if (diff <= 0) {
      clearInterval(timerId);
      alert("Countdown finished!");
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(diff);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }, 1000);
});

function convertMs(ms) {

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;


  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

