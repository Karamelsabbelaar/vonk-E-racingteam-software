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

    const ERonde1 = document.getElementById("Ronde1");
    const ERonde2 = document.getElementById("Ronde2");
    const ERonde3 = document.getElementById("Ronde3");
    const EFast = document.getElementById("FastTime");
    const ESlow = document.getElementById("SlowTime");
    const EGem = document.getElementById("GemTime");

    if (Time < Fast){
        Fast = Time
        EFast.textContent = MM + ':' + SS + ',' + MS;
    }

    Ronde3 = Ronde2;
    Ronde2 = Ronde1;
    Ronde1 = Time;

    MM3 = MM2
    SS3 = SS2
    MS3 = MS2
    MM2 = MM1
    SS2 = SS1
    MS2 = MS1
    MM1 = MM
    SS1 = SS
    MS1 = MS
    console.log(MM1);
    console.log(SS1);
    console.log(MS1);

    ERonde1.textContent = MM1 + ":" + SS1 + "," + MS1;
    ERonde2.textContent = MM2 + ":" + SS2 + "," + MS2;
    ERonde3.textContent = MM3 + ":" + SS3 + "," + MS3;

    if (Time > Slow){
        Slow = Time
        ESlow.textContent = MM + ":" + SS + "," + MS;
    }

    Total = Total + Time;

    console.log("Total is:");
    console.log(Total);

    let Gem = Total / Rondes;

    let GemMM = Math.round(+Gem / 1000 / 60);
    let GemSS = Math.round((+Gem -(+GemMM * 1000 * 60)) / 1000);
    let GemMS = Math.round((+Gem -(+GemSS * 1000)) - (+GemMM * 1000 * 60));

    console.log("Gems zijn:");
    console.log(GemMM);
    console.log(GemSS);
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
