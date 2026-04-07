const knop3 = document.getElementById('toevoegknop3');
const Klik3 = document.getElementById('nameButton3');
let RondesC = 0;
let FastC = 999999999;
let SlowC = 0;
let Ronde3C = 0;
let Ronde2C = 0;
let Ronde1C = 0;
let TotalC = 0;
let MM3C = 0;
let SS3C = 0;
let MS3C = 0;
let MM2C = 0;
let SS2C = 0;
let MS2C = 0;
let MM1C = 0;
let SS1C = 0;
let MS1C = 0;
let Name3 = "";
let TimeC = 0;

Klik3.addEventListener('click', () => {
        Name3 = document.forms["Name3"]["nameInput3"].value;

    const EName3 = document.getElementById("Name3");
    EName3.remove();
        console.log("Aantal rondes:")
    console.log(RondesC);
   TimeC = toMilliseconds(MM, SS, MS);
   console.log("Time in MS:")
    console.log(Time)
        console.log(GemMS);

    EGem.textContent = GemMM + ":" + GemSS + "," + GemMS;
    driver = Name3;
    lap_ms = TimeC;
    lap_number = RondesC;
    console.log("Driver:", driver);
    console.log("Lap number:", lap_number);
    console.log("Lap time (ms):", lap_ms);
    addLapTime();
});