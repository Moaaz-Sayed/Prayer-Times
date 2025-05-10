let city = document.getElementById("city");
let fajr = document.getElementById("fajr");
let shorok = document.getElementById("shorok");
let duhr = document.getElementById("duhr");
let asr = document.getElementById("asr");
let mighreb = document.getElementById("mighreb");
let isha = document.getElementById("isha");
let cityName = document.getElementById("cityName");
let date = document.getElementById("date");

city.onchange = function () {
  getTimes();
  cityName.innerHTML = city.options[city.selectedIndex].text;
};

function getTimes() {
  axios
    .get(
      `https://api.aladhan.com/v1/timingsByCity?city=${city.value}&country=Egypt&method=5`
    )
    .then((response) => {
      let times = response.data.data.timings;
      getNextPrayer(times);
      let innerDate = response.data.data.date;
      fajr.innerHTML = formatTo12Hour(times.Fajr);
      shorok.innerHTML = formatTo12Hour(times.Sunrise);
      duhr.innerHTML = formatTo12Hour(times.Dhuhr);
      asr.innerHTML = formatTo12Hour(times.Asr);
      mighreb.innerHTML = formatTo12Hour(times.Maghrib);
      isha.innerHTML = formatTo12Hour(times.Isha);
      date.innerHTML = `${innerDate.hijri.weekday.ar} ${innerDate.hijri.day} ${innerDate.hijri.month.ar} ${innerDate.hijri.year} هـ - ${innerDate.gregorian.date} م`;
    })
    .catch((e) => {
      let errorBox = document.getElementById("errorBox");
      errorBox.style.display = "block";

      setTimeout(() => {
        errorBox.style.display = "none";
      }, 100000000);
    });
  document.getElementById("closeError").onclick = function () {
    document.getElementById("errorBox").style.display = "none";
  };
}

function formatTo12Hour(time24) {
  const [hours, minutes] = time24.split(":");
  const date = new Date();
  date.setHours(+hours);
  date.setMinutes(+minutes);

  return date.toLocaleTimeString("ar-EG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function displayNextPrayerTime(nextPrayer, hours, minutes) {
  let nextPrayerTimeElement = document.getElementById("next-time");
  nextPrayerTimeElement.innerHTML = `وقت الصلاة التالى: ${nextPrayer.name} بعد ${hours} ساعات , ${minutes}دقيقة`;
}
function getNextPrayer(times) {
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();
  let day = today.getDate();

  let fajrTime = new Date(
    year,
    month,
    day,
    ...times.Fajr.split(":").map(Number)
  );
  let duhrTime = new Date(
    year,
    month,
    day,
    ...times.Dhuhr.split(":").map(Number)
  );
  let asrTime = new Date(year, month, day, ...times.Asr.split(":").map(Number));
  let maghribTime = new Date(
    year,
    month,
    day,
    ...times.Maghrib.split(":").map(Number)
  );
  let ishaTime = new Date(
    year,
    month,
    day,
    ...times.Isha.split(":").map(Number)
  );

  let prayers = [
    { name: "الفجْر", time: fajrTime },
    { name: "الظهر", time: duhrTime },
    { name: "العصر", time: asrTime },
    { name: "المغرب", time: maghribTime },
    { name: "العشاء", time: ishaTime },
  ];

  let nextPrayer = null;

  for (let prayer of prayers) {
    if (today < prayer.time) {
      nextPrayer = prayer;
      break;
    }
  }

  if (!nextPrayer) {
    nextPrayer = { name: "الفجر", time: fajrTime };
    nextPrayer.time.setDate(nextPrayer.time.getDate() + 1);
  }
  let remainingTime = nextPrayer.time - today;
  let hours = Math.floor(remainingTime / (1000 * 60 * 60));
  let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  displayNextPrayerTime(nextPrayer, hours, minutes);
}

getTimes();
