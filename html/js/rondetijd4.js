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
    console.log("Aantal rondes:")
    console.log(RondesD);
    TimeD = toMilliseconds(MM, SS, MS);
    console.log("Time in MS:")
    console.log(Time)
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
