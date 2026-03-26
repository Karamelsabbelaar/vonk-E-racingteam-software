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
    const TextName3 = document.getElementById("TextName3");
    TextName3.textContent = Name3;
});

function toMilliseconds(MM, SS, MS)
{
    return (Number(MM) * 60 * 1000) + (Number(SS) * 1000) + Number(MS);
}

knop3.addEventListener('click', () => {
    let MM = document.forms["Kart3"]["minutesC"].value,
    SS = document.forms["Kart3"]["secondsC"].value,
    MS = document.forms["Kart3"]["millisecondsC"].value;
    console.log(MM);
    console.log(SS);
    console.log(MS);
    RondesC = RondesC + 1;
    console.log("Aantal rondes:")
    console.log(RondesC);

   TimeC = toMilliseconds(MM, SS, MS);
   console.log("Time in MS:")
    console.log(Time)

    const ERonde1 = document.getElementById("Ronde1C");
    const ERonde2 = document.getElementById("Ronde2C");
    const ERonde3 = document.getElementById("Ronde3C");
    const EFast = document.getElementById("FastTimeC");
    const ESlow = document.getElementById("SlowTimeC");
    const EGem = document.getElementById("GemTimeC");

    if (Time < FastC){
        FastC = Time
        EFast.textContent = MM + ':' + SS + ',' + MS;
    }

    Ronde3C = Ronde2C;
    Ronde2C = Ronde1C;
    Ronde1C = Time;

    MM3C = MM2C
    SS3C = SS2C
    MS3C = MS2C
    MM2C = MM1C
    SS2C = SS1C
    MS2C = MS1C
    MM1C = MM
    SS1C = SS
    MS1C = MS
    console.log(MM1C);
    console.log(SS1C);
    console.log(MS1C);

    ERonde1.textContent = MM1C + ":" + SS1C + "," + MS1C;
    ERonde2.textContent = MM2C + ":" + SS2C + "," + MS2C;
    ERonde3.textContent = MM3C + ":" + SS3C + "," + MS3C;

    if (Time > SlowC){
        SlowC = Time
        ESlow.textContent = MM + ":" + SS + "," + MS;
    }

    TotalC = TotalC + Time;

    console.log("Total is:");
    console.log(TotalC);

    let Gem = TotalC / RondesC;

    let GemMM = Math.round(+Gem / 1000 / 60);
    let GemSS = Math.round((+Gem -(+GemMM * 1000 * 60)) / 1000);
    let GemMS = Math.round((+Gem -(+GemSS * 1000)) - (+GemMM * 1000 * 60));

    console.log("Gems zijn:");
    console.log(GemMM);
    console.log(GemSS);
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
