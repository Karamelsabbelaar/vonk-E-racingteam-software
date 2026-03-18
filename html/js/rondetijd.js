const knop = document.getElementById('toevoegknop');
let Rondes = 0;
let Fast = 0;
let Slow = 0;
let Ronde3 = 0;
let Ronde2 = 0;
let Ronde1 = 0;
let Total = 0;
knop.addEventListener('click', () => {
    let MM = document.forms["Kart1"]["minutes"].value,
    SS = document.forms["Kart1"]["seconds"].value,
    MS = document.forms["Kart1"]["milliseconds"].value;
    console.log(MM);
    console.log(SS);
    console.log(MS);
    Rondes = Rondes + 1;

    let Time = (MM * 60 * 100) + (SS * 100) + MS;

    console.log(Time)

    const ERonde1 = document.getElementById("Ronde1");
    const ERonde2 = document.getElementById("Ronde2");
    const ERonde3 = document.getElementById("Ronde3");
    const EFast = document.getElementById("FastTime");
    const ESlow = document.getElementById("SlowTime");
    const EGem = document.getElementById("GemTime");

    if (Time > Fast){
        Fast = Time
        EFast.textContent = MM, ":", SS, ",", MS;
    }

    Ronde3 = Ronde2;
    Ronde2 = Ronde1;
    Ronde1 = Time;

    let MM3 = Math.round(Ronde3 / 100 / 60);
    let SS3 = Math.round(Ronde3 -(MM3 * 60 * 100) / 100);
    let MS3 = Math.round(Ronde3 -(SS3 * 100))

    let MM2 = Math.round(Ronde2 / 100 / 60);
    let SS2 = Math.round(Ronde2 -(MM2 * 60 * 100) / 100);
    let MS2 = Math.round(Ronde2 -(SS2 * 100))

    let MM1 = Math.round(Ronde1 / 100 / 60);
    let SS1 = Math.round(Ronde1 -(MM1 * 60 * 100) / 100);
    let MS1 = Math.round(Ronde1 -(SS1 * 100 + MM1 * 60 * 100))
    console.log(MM1);
    console.log(SS1);
    console.log(MS1);

    ERonde1.textContent = MM1, ":", SS1, ",", MS1;
    ERonde2.textContent = MM2, ":", SS2, ",", MS2;
    ERonde3.textContent = MM3, ":", SS3, ",", MS3;

    if (Time < Slow){
        Slow = Time
        ESlow.textContent = MM, ":", SS, ",", MS;
    }

    Total = Total + Time;

    let Gem = Total / Rondes;

    let GemMM = Math.round(Gem / 100 / 60);
    let GemSS = Math.round(Gem -(GemMM * 60 * 100) / 100);
    let GemMS = Math.round(Gem -(GemSS * 100));

    EGem.textContent = GemMM, ":", GemSS, ",", GemMS;
});
