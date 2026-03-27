const knop2 = document.getElementById('toevoegknop2');
const Klik2 = document.getElementById('nameButton2');
let RondesB = 0;
let FastB = 999999999;
let SlowB = 0;
let Ronde3B = 0;
let Ronde2B = 0;
let Ronde1B = 0;
let TotalB = 0;
let MM3B = 0;
let SS3B = 0;
let MS3B = 0;
let MM2B = 0;
let SS2B = 0;
let MS2B = 0;
let MM1B = 0;
let SS1B = 0;
let MS1B = 0;
let Name2 = "";
let TimeB = 0;

Klik2.addEventListener('click', () => {
        Name2 = document.forms["Name2"]["nameInput2"].value;

    const EName2 = document.getElementById("Name2");
    EName2.remove();
        console.log("Aantal rondes:")
    console.log(RondesB);
    TimeB = toMilliseconds(MM, SS, MS);
    console.log("Time in MS:")
    console.log(Time)

    const ERonde1 = document.getElementById("Ronde1B");
        console.log(GemMS);

    EGem.textContent = GemMM + ":" + GemSS + "," + GemMS;

    driver = Name2;
  lap_ms = TimeB;
  lap_number = RondesB;
  console.log("Driver:", driver);
  console.log("Lap number:", lap_number);
  console.log("Lap time (ms):", lap_ms);
  addLapTime();
});