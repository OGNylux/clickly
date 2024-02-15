export function test2(num: number) {
    for (let i = 0; i < stringNumbers.length; i++) {
        let test;
        const test3 = (1000 ** i);
        const test4 = (1000 ** (i+1));
        if (num >= test3 && num < test4) {
            test = (num / test3).toFixed(3);
            return test + " " + stringNumbers[i];
        }
    }
}

const stringNumbers = [
    "",
    "",
    "Million",
    "Billion",
    "Trillion",
    "Quadrillion",
    "Quintillion",
    "Sextillion",
    "Septillion",
    "Octillion",
    "Nonillion",
    "Decillion",
    "Undecillion",
    "Duodecillion",
    "Tredecillion",
    "Quattuordecillion",
    "Quindecillion",
    "Sexdecillion",
    "Septendecillion",
    "Octodecillion",
    "Novemdecillion",
    "Vigintillion",
    "Unvigintillion",
    "Duovigintillion",
    "Trevigintillion",
    "Quattuorvigintillion",
    "Quinvigintillion",
    "Sexvigintillion",
    "Septenvigintillion",
    "Octovigintillion",
    "Novemvigintillion",
    "Trigintillion",
    "Untrigintillion",
    "Duotrigintillion",
    "Tretrigintillion",
    "Quattuortrigintillion",
    "Quintrigintillion",
    "Sextrigintillion",
    "Septentrigintillion",
    "Octotrigintillion",
    "Novemtrigintillion",
    "Quadragintillion",
    "Unquadragintillion",
    "Duoquadragintillion",
    "Trequadragintillion",
    "Quattuorquadragintillion",
    "Quinquadragintillion",
    "Sexquadragintillion",
    "Septenquadragintillion",
    "Octoquadragintillion",
    "Novemquadragintillion",
    "Quinquagintillion",
    "Unquinquagintillion",
    "Duoquinquagintillion",
    "Trequinquagintillion",
    "Quattuorquinquagintillion"
];


