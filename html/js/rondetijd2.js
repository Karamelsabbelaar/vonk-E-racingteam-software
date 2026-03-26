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
    const TextName2 = document.getElementById("TextName2");
    TextName2.textContent = Name2;
});

function toMilliseconds(MM, SS, MS)
{
    return (Number(MM) * 60 * 1000) + (Number(SS) * 1000) + Number(MS);
}

knop2.addEventListener('click', () => {
    let MM = document.forms["Kart2"]["minutesB"].value,
    SS = document.forms["Kart2"]["secondsB"].value,
    MS = document.forms["Kart2"]["millisecondsB"].value;
    console.log(MM);
    console.log(SS);
    console.log(MS);
    RondesB = RondesB + 1;
    console.log("Aantal rondes:")
    console.log(RondesB);

    TimeB = toMilliseconds(MM, SS, MS);
    console.log("Time in MS:")
    console.log(Time)

    const ERonde1 = document.getElementById("Ronde1B");
    const ERonde2 = document.getElementById("Ronde2B");
    const ERonde3 = document.getElementById("Ronde3B");
    const EFast = document.getElementById("FastTimeB");
    const ESlow = document.getElementById("SlowTimeB");
    const EGem = document.getElementById("GemTimeB");

    if (Time < FastB){
        FastB = Time
        EFast.textContent = MM + ':' + SS + ',' + MS;
    }

    Ronde3B = Ronde2B;
    Ronde2B = Ronde1B;
    Ronde1B = Time;

    MM3B = MM2B
    SS3B = SS2B
    MS3B = MS2B
    MM2B = MM1B
    SS2B = SS1B
    MS2B = MS1B
    MM1B = MM
    SS1B = SS
    MS1B = MS
    console.log(MM1B);
    console.log(SS1B);
    console.log(MS1B);

    ERonde1.textContent = MM1B + ":" + SS1B + "," + MS1B;
    ERonde2.textContent = MM2B + ":" + SS2B + "," + MS2B;
    ERonde3.textContent = MM3B + ":" + SS3B + "," + MS3B;

    if (Time > SlowB){
        SlowB = Time
        ESlow.textContent = MM + ":" + SS + "," + MS;
    }

    TotalB = TotalB + Time;

    console.log("Total is:");
    console.log(TotalB);

    let Gem = TotalB / RondesB;

    let GemMM = Math.round(+Gem / 1000 / 60);
    let GemSS = Math.round((+Gem -(+GemMM * 1000 * 60)) / 1000);
    let GemMS = Math.round((+Gem -(+GemSS * 1000)) - (+GemMM * 1000 * 60));

    console.log("Gems zijn:");
    console.log(GemMM);
    console.log(GemSS);
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
