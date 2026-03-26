const knop4 = document.getElementById('toevoegknop4');
const Klik4 = document.getElementById('nameButton4');
let RondesD = 0;
let FastD = 999999999;
let SlowD = 0;
let Ronde3D = 0;
let Ronde2D = 0;
let Ronde1D = 0;
let TotalD = 0;
let MM3D = 0;
let SS3D = 0;
let MS3D = 0;
let MM2D = 0;
let SS2D = 0;
let MS2D = 0;
let MM1D = 0;
let SS1D = 0;
let MS1D = 0;
let Name4 = "";
let TimeD = 0;

Klik4.addEventListener('click', () => {
    Name4 = document.forms["Name4"]["nameInput4"].value;

    const EName4 = document.getElementById("Name4");
    EName4.remove();
    const TextName4 = document.getElementById("TextName4");
    TextName4.textContent = Name4;
});

function toMilliseconds(MM, SS, MS)
{
    return (Number(MM) * 60 * 1000) + (Number(SS) * 1000) + Number(MS);
}

knop4.addEventListener('click', () => {
    let MM = document.forms["Kart4"]["minutesD"].value,
    SS = document.forms["Kart4"]["secondsD"].value,
    MS = document.forms["Kart4"]["millisecondsD"].value;
    console.log(MM);
    console.log(SS);
    console.log(MS);
    RondesD = RondesD + 1;
    console.log("Aantal rondes:")
    console.log(RondesD);

   TimeD = toMilliseconds(MM, SS, MS);
   console.log("Time in MS:")
    console.log(Time)

    const ERonde1 = document.getElementById("Ronde1D");
    const ERonde2 = document.getElementById("Ronde2D");
    const ERonde3 = document.getElementById("Ronde3D");
    const EFast = document.getElementById("FastTimeD");
    const ESlow = document.getElementById("SlowTimeD");
    const EGem = document.getElementById("GemTimeD");

    if (Time < FastD){
        FastD = Time
        EFast.textContent = MM + ':' + SS + ',' + MS;
    }

    Ronde3D = Ronde2D;
    Ronde2D = Ronde1D;
    Ronde1D = Time;

    MM3D = MM2D
    SS3D = SS2D
    MS3D = MS2D
    MM2D = MM1D
    SS2D = SS1D
    MS2D = MS1D
    MM1D = MM
    SS1D = SS
    MS1D = MS
    console.log(MM1D);
    console.log(SS1D);
    console.log(MS1D);

    ERonde1.textContent = MM1D + ":" + SS1D + "," + MS1D;
    ERonde2.textContent = MM2D + ":" + SS2D + "," + MS2D;
    ERonde3.textContent = MM3D + ":" + SS3D + "," + MS3D;

    if (Time > SlowD){
        SlowD = Time
        ESlow.textContent = MM + ":" + SS + "," + MS;
    }

    TotalD = TotalD + Time;

    console.log("Total is:");
    console.log(TotalD);

    let Gem = TotalD / RondesD;

    let GemMM = Math.round(+Gem / 1000 / 60);
    let GemSS = Math.round((+Gem -(+GemMM * 1000 * 60)) / 1000);
    let GemMS = Math.round((+Gem -(+GemSS * 1000)) - (+GemMM * 1000 * 60));

    console.log("Gems zijn:");
    console.log(GemMM);
    console.log(GemSS);
    console.log(GemMS);

    EGem.textContent = GemMM + ":" + GemSS + "," + GemMS;
    driver = Name4;
  lap_ms = TimeD;
  lap_number = RondesD;
  console.log("Driver:", driver);
  console.log("Lap number:", lap_number);
  console.log("Lap time (ms):", lap_ms);
  addLapTime();
});
