const knop = document.getElementById('toevoegknop');
const Klik = document.getElementById('nameButton1');
let Rondes = 0;
let Fast = 999999999;
let Slow = 0;
let Ronde3 = 0;
let Ronde2 = 0;
let Ronde1 = 0;
let Total = 0;
let MM3 = 0;
let SS3 = 0;
let MS3 = 0;
let MM2 = 0;
let SS2 = 0;
let MS2 = 0;
let MM1 = 0;
let SS1 = 0;
let MS1 = 0;
let Name1 = "";
let Time = 0;

Klik.addEventListener('click', () => {
    Name1 = document.forms["Name1"]["nameInput1"].value;

    const EName1 = document.getElementById("Name1");
    EName1.remove();
    const TextName1 = document.getElementById("TextName1");
    TextName1.textContent = Name1;
});

function toMilliseconds(MM, SS, MS)
{
    return (Number(MM) * 60 * 1000) + (Number(SS) * 1000) + Number(MS);
}

knop.addEventListener('click', () => {
    let MM = document.forms["Kart1"]["minutes"].value,
    SS = document.forms["Kart1"]["seconds"].value,
    MS = document.forms["Kart1"]["milliseconds"].value;
    console.log(MM);
    console.log(SS);
    console.log(MS);
    Rondes = Rondes + 1;
    console.log("Aantal rondes:")
    console.log(Rondes);
   Time = toMilliseconds(MM, SS, MS);
   console.log("Time in MS:")
    console.log(Time)
    console.log(GemMS);

    EGem.textContent = GemMM + ":" + GemSS + "," + GemMS;

    driver = Name1;
    lap_ms = Time;
    lap_number = Rondes;
    console.log("Driver:", driver);
    console.log("Lap number:", lap_number);
    console.log("Lap time (ms):", lap_ms);
    addLapTime();
});