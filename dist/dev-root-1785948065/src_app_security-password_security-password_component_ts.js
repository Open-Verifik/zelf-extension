"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_security-password_security-password_component_ts"],{

/***/ 29569
/*!************************************!*\
  !*** ./src/app/captcha.service.ts ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CaptchaService: () => (/* binding */ CaptchaService)
/* harmony export */ });
/* harmony import */ var environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _chrome_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chrome.service */ 85043);



class CaptchaService {
  _chromeService;
  captchaToken = "";
  constructor(_chromeService) {
    this._chromeService = _chromeService;
  }
  executeRecaptcha(action) {
    if (this._chromeService.isExtension) return Promise.resolve("");
    return new Promise((resolve, reject) => {
      if (typeof grecaptcha !== "undefined") {
        grecaptcha.enterprise.ready(() => {
          grecaptcha.enterprise.execute(environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment?.captchaKey, {
            action
          }).then(token => resolve(token)).catch(err => reject(err));
        });
      } else {
        reject("reCAPTCHA not loaded");
      }
    });
  }
  retainCaptchaToken(token) {
    this.captchaToken = token;
  }
  getCaptchaToken() {
    return this.captchaToken;
  }
  static ɵfac = function CaptchaService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CaptchaService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_chrome_service__WEBPACK_IMPORTED_MODULE_2__.ChromeService));
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: CaptchaService,
    factory: CaptchaService.ɵfac,
    providedIn: "root"
  });
}

/***/ },

/***/ 29906
/*!***********************************************************!*\
  !*** ./src/app/password-strength/common-password-list.ts ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (["123456", "123456789", "password", "qwerty", "12345678", "12345", "123123", "111111", "1234", "1234567890", "1234567", "abc123", "1q2w3e4r5t", "q1w2e3r4t5y6", "iloveyou", "123", "000000", "123321", "1q2w3e4r", "qwertyuiop", "yuantuo2012", "654321", "qwerty123", "1qaz2wsx3edc", "password1", "1qaz2wsx", "666666", "dragon", "ashley", "princess", "987654321", "123qwe", "159753", "monkey", "q1w2e3r4", "zxcvbnm", "123123123", "asdfghjkl", "pokemon", "football", "killer", "112233", "michael", "shadow", "121212", "daniel", "asdasd", "qazwsx", "1234qwer", "superman", "123456a", "azerty", "qwe123", "master", "7777777", "sunshine", "N0=Acc3ss", "1q2w3e", "abcd1234", "1234561", "computer", "fuckyou", "aaaaaa", "555555", "asdfgh", "asd123", "baseball", "0123456789", "charlie", "123654", "qwer1234", "naruto", "a123456", "jessica", "Status", "soccer", "jordan", "liverpool", "thomas", "lol123", "michelle", "123abc", "nicole", "11111111", "starwars", "samsung", "1111", "secret", "joshua", "123456789a", "andrew", "222222", "q1w2e3r4t5", "147258369", "hunter", "Password", "qazwsxedc", "lovely", "999999", "jennifer", "letmein", "tigger", "asdf1234", "hannah", "purple", "justin", "qwerty1", "anthony", "welcome", "love", "159357", "789456123", "aa123456", "qweasdzxc", "internet", "robert", "minecraft", "super123", "batman", "trustno1", "matthew", "789456", "88888888", "5201314", "chocolate", "flower", "cookie", "D1lakiss", "william", "102030", "cheese", "buster", "pakistan", "chelsea", "alexander", "888888", "12341234", "987654", "andrea", "777777", "hello", "samantha", "1234567891", "blink182", "freedom", "matrix", "george", "amanda", "1qazxsw2", "forever", "martin", "patrick", "iloveu", "babygirl", "summer", "friends", "whatever", "12qwaszx", "pepper", "zaq12wsx", "212121", "butterfly", "0000", "orange", "jasmine", "joseph", "maggie", "banana", "arsenal", "mustang", "11111", "monster", "passw0rd", "jonathan", "snoopy", "0987654321", "family", "changeme", "131313", "123qweasd", "ginger", "angel", "junior", "diamond", "asdfasdf", "taylor", "eminem", "oliver", "Exigent", "147258", "basketball", "sophie", "loveme", "mother", "benjamin", "silver", "333333", "101010", "harley", "Password1", "spiderman", "chicken", "a123456789", "asshole", "123654789", "12345678910", "696969", "qweasd", "yellow", "melissa", "qwertyui", "christian", "nathan", "anhyeuem", "brandon", "richard", "nks230kjs82", "rr123456rr", "metallica", "never", "00000000", "123hfjdk147", "lovers", "mercedes", "123456abc", "gabriel", "password123", "loveyou", "mickey", "147852369", "1111111", "010203", "bailey", "hello123", "sandra", "london", "qwerty12", "zxcvbn", "q1w2e3", "slipknot", "741852963", "qwerty12345", "prince", "hockey", "55555", "angels", "peanut", "victoria", "12344321", "asdf", "angela", "rainbow", "abcdef", "ferrari", "google", "cocacola", "1111111111", "hahaha", "carlos", "gfhjkm", "qweqwe", "456789", "12345qwert", "jordan23", "11223344", "bubbles", "steven", "samuel", "rental", "xxxxxx", "00000", "0123456", "barbie", "morgan", "asdasdasd", "alexis", "elizabeth", "michael1", "austin", "nicholas", "school", "1q2w3e4r5t6y", "lollol", "barcelona", "pokemon1", "iloveyou1", "147852", "87654321", "diablo", "jasper", "liverpool1", "phoenix", "madison", "vanessa", "jackson", "123qweasdzxc", "danielle", "marina", "jesus", "xbox360", "pretty", "thunder", "bandit", "Indya123", "a1b2c3d4", "232323", "adidas", "dennis", "edward", "ronaldo", "adrian", "rachel", "tennis", "destiny", "fuckoff", "startfinding", "friendster", "lauren", "qqqqqq", "456123", "<password>", "darkness", "nicolas", "nirvana", "mylove", "scooter", "fashion", "merlin", "qazwsx123", "sakura", "david", "charlie1", "vincent", "casper", "asdfghjk", "november", "juventus", "lizottes", "spider", "smokey", "1234abcd", "abcdefg", "december", "lalala", "spongebob", "booboo", "chester", "loulou", "heather", "qwert", "america", "yamaha", "princess1", "123789", "monica", "victor", "canada", "scorpion", "friend", "antonio", "sebastian", "nintendo", "awesome", "nikita", "rebecca", "sabrina", "bhf", "midnight", "sweety", "testing", "passwort", "852456", "azertyuiop", "hg0209", "Groupd2013", "olivia", "johnny", "patricia", "warcraft", "stella", "comeon11", "guitar", "jeremy", "qwe", "playboy", "charles", "creative", "elephant", "football1", "R9lw4j8khX", "fucker", "caroline", "12345a", "123qwe123", "crystal", "louise", "success", "compaq", "cameron", "inuyasha", "maverick", "scooby", "alexandra", "james", "garfield", "apples", "123456aa", "gemini", "lovelove", "dolphin", "dakota", "september", "logitech", "a12345", "qwaszx", "hotmail", "444444", "qazxsw", "sasuke", "sparky", "hallo123", "magic", "test", "aaaaaaaa", "twilight", "tweety", "shannon", "myspace1", "beautiful", "stephanie", "asdasd123", "swordfish", "jessie", "tinkerbell", "2012comeer", "flowers", "0000000000", "doudou", "cooper", "charlotte", "dallas", "999999999", "hellokitty", "winner", "159951", "1a2b3c4d", "love123", "nothing", "abc123456", "test123", "111222", "badboy", "heaven", "qwert123", "windows", "hardcore", "qwertyu", "muffin", "252525", "tigers", "manchester", "yankees", "123456q", "jackie", "money", "popcorn", "cherry", "marseille", "111", "welcome1", "marlboro", "poohbear", "kitten", "fuckme", "newyork", "753951", "fuckyou1", "slayer", "qaz123", "sayang", "142536", "rabbit", "1234554321", "ranger", "barney", "icecream", "12121212", "veronica", "a1b2c3", "lol", "dexter", "melanie", "kimberly", "123456789q", "precious", "pass", "marvin", "lakers", "chris", "natasha", "lollipop", "scorpio", "p", "alex", "123451", "albert", "zzzzzz", "tiffany", "hello1", "peaches", "rangers", "murphy", "carolina", "soleil", "india123", "august", "54321", "christine", "disney", "jessica1", "greenday", "portugal", "hacker", "bonnie", "brandy", "newpass", "951753", "9876543210", "camille", "winter", "qq123456", "boomer", "jesus1", "246810", "leonardo", "october", "PASSWORD", "superman1", "beauty", "124578", "1234567a", "daniela", "poopoo", "Abcd1234", "samson", "cristina", "music", "winston", "angelo", "741852", "123asd", "coffee", "manuel", "zxc123", "player", "bismillah", "4815162342", "aaaa", "honey", "a1234567", "fluffy", "parola", "alyssa", "claudia", "134679", "456456", "genius", "horses", "hiphop", "angel1", "jackass", "1212", "steelers", "asd123456", "monkey1", "arthur", "runescape", "matthew1", "qwerty123456", "golden", "happy", "simpsons", "denise", "red123", "tintin", "toyota", "vegeta", "963852741", "sydney", "isabella", "francis", "porsche", "1314520", "miguel", "sterling", "turtle", "pikachu", "arsenal1", "hottie", "blabla", "stupid", "hallo", "anthony1", "police", "chelsea1", "mar", "mahalkita", "softball", "snickers", "catherine", "trinity", "vampire", "cassie", "fantasy", "kenneth", "rockstar", "12345qwerty", "bonjour", "eagles", "snowball", "pumpkin", "corvette", "maxwell", "marine", "aaaaa", "jakjak", "wilson", "7654321", "willow", "pussy", "gateway", "motorola", "098765", "simple", "cookies", "dancer", "hammer", "12345678a", "1029384756", "maria", "connor", "fernando", "abc12345", "carmen", "natalie", "florida", "falcon", "polska", "remember", "woaini", "biteme", "sarah", "321321", "fender", "emmanuel", "simone", "qwertz", "brittany", "blahblah", "barbara", "alicia", "pookie", "qwerty1234", "knight", "sniper", "shopping", "isabelle", "parker", "freddy", "youbye123", "marcus", "please", "superstar", "computer1", "n", "hotdog", "cambiami", "pass123", "asdfg", "lucky", "sanane", "monika", "christ", "123698745", "fishing", "kawasaki", "6V21wbgad", "iceman", "cowboy", "kevin", "1122334455", "courtney", "pamela", "krishna", "julian", "tiger", "aobo2010", "21212121", "qqww1122", "password12", "penguin", "valentina", "miller", "010101", "fuckyou2", "brooklyn", "50cent", "warrior", "boston", "lolipop", "jerome", "qwerasdf", "shorty", "scarface", "pa55word", "people", "claire", "william1", "pogiako", "chicago", "456852", "1123581321", "johnson", "chris1", "ryan", "demon1q2w3e", "123123a", "wizard", "angelina", "williams", "stephen", "christopher", "7758521", "iloveyou2", "shelby", "bulldog", "undertaker", "fatima", "cowboys", "jasmin", "linkinpark", "drowssap", "teresa", "fuck", "sierra", "angelica", "tucker", "lolita", "online", "mexico", "demon1q2w3e4r", "007007", "sunshine1", "bullshit", "202020", "ghbdtn", "1464688081", "pierre", "blessed", "manutd", "012345", "cricket", "qazqaz", "asdqwe123", "winnie", "butter", "nonmember", "sweetie", "baseball1", "iloveme", "admin", "passion", "a1s2d3f4", "xavier", "dolphins", "paradise", "skyline", "redsox", "demon1q2w3e4r5t", "1a2b3c", "genesis", "mmmmmm", "135790", "poop", "lincogo1", "exigent", "gandalf", "159753qq", "nascar", "chouchou", "apple", "zxcvbnm123", "password2", "ihateyou", "qwert12345", "stefan", "stargate", "12345q", "microsoft", "january", "chance", "christina", "jason", "dragonball", "gangster", "potter", "roberto", "killer123", "speedy", "black", "i", "spencer", "147896325", "alejandro", "martina", "santiago", "jeffrey", "teacher", "rosebud", "raymond", "nissan", "nelson", "qweasd123", "cupcake", "Passw0rd", "sophia", "nigger", "natalia", "kristina", "bananas", "legolas", "indian", "sexy", "jaguar", "calvin", "lorenzo", "access", "strawberry", "sunflower", "sharon", "bigdaddy", "Blink123", "travis", "united", "bianca", "cme2012", "assassin", "Telechargement", "1234512345", "baby", "champion", "justine", "avatar", "151515", "brandon1", "green", "abcdefgh", "mnbvcxz", "raiders", "1234560", "panther", "mamapapa", "donald", "starwars1", "asd", "harrypotter", "mike", "141414", "legend", "samsung1", "789789", "john", "zachary", "westside", "ssssss", "a12345678", "dragon1", "7777", "m", "kingkong", "facebook", "carter", "skater", "motdepasse", "gundam", "phantom", "bearshare", "doctor", "karina", "asdf123", "asdf12345", "montana", "loverboy", "alexandre", "celtic", "cool", "megaparol12345", "4444", "orlando", "bond007", "pokemon123", "minnie", "maryjane", "ragnarok", "millie", "savannah", "159159", "walter", "mahalko", "kissme", "damian", "anderson", "element", "peter", "hamster", "abigail", "animal", "jasmine1", "786786", "california", "system", "helpme", "apollo", "gracie", "ladybug", "australia", "qwer", "valentin", "pauline", "frankie", "cancer", "siemens", "realmadrid", "zxcvbnm1", "justinbieber", "kitty", "megaman", "admin123", "baili123com", "wow12345", "rush2112", "einstein", "marley", "321654", "5555", "100", "timothy", "startrek", "qwerty321", "unicorn", "audrey", "maganda", "golfcourse", "rafael", "2222", "france", "security", "tristan", "dreams", "harvey", "marie", "pk3x7w9W", "hitman", "ficken", "coucou", "8675309", "debbie", "1qa2ws3ed", "andreas", "freedom1", "hesoyam", "florian", "nyq28Giz1Z", "cheyenne", "celine", "florence", "0000000", "spirit", "test1234", "tamara", "maximus", "ricardo", "bitch", "lucky1", "copper", "jupiter", "marcel", "andrei", "chicken1", "domino", "oblivion", "crossfire", "bestfriend", "pantera", "brenda", "camaro", "buddy", "pass1234", "rocket", "g13916055158"]);

/***/ },

/***/ 98388
/*!******************************************************************!*\
  !*** ./src/app/password-strength/password-strength.component.ts ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PasswordStrengthComponent: () => (/* binding */ PasswordStrengthComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 75797);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 63617);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 52575);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 89475);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs */ 70271);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 32112);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs */ 36647);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs */ 33900);
/* harmony import */ var _common_password_list__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./common-password-list */ 29906);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/core */ 37580);








const _c0 = (a0, a1, a2) => ({
  "password-strength__bar--weak": a0,
  "password-strength__bar--medium": a1,
  "password-strength__bar--strong": a2
});
const _c1 = (a0, a1, a2) => ({
  "password-strength__label--weak": a0,
  "password-strength__label--medium": a1,
  "password-strength__label--strong": a2
});
const _c2 = a0 => ({
  "expandable__label--active": a0
});
const _c3 = a0 => ({
  "expandable__content--active": a0
});
function PasswordStrengthComponent_div_0_span_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "\u00A0");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function PasswordStrengthComponent_div_0_span_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r2("security.weak"));
  }
}
function PasswordStrengthComponent_div_0_span_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r2("security.medium"));
  }
}
function PasswordStrengthComponent_div_0_span_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r2("security.strong"));
  }
}
function PasswordStrengthComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 1)(1, "p", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](4, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](6, PasswordStrengthComponent_div_0_span_6_Template, 2, 0, "span", 6)(7, PasswordStrengthComponent_div_0_span_7_Template, 2, 1, "span", 6)(8, PasswordStrengthComponent_div_0_span_8_Template, 2, 1, "span", 6)(9, PasswordStrengthComponent_div_0_span_9_Template, 2, 1, "span", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](10, "div", 7)(11, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function PasswordStrengthComponent_div_0_Template_div_click_11_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r1);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r2.toggleExpand());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "p", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "svg", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](15, "path", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "div", 12)(17, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](18, "p", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const t_r2 = ctx.$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r2("security.password_strength_label"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("width", ctx_r2.passwordStrengthPercentage + "%");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction3"](13, _c0, ctx_r2.strength < 8, ctx_r2.strength >= 8 && ctx_r2.strength < 13, ctx_r2.strength >= 13));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction3"](17, _c1, ctx_r2.strength < 8, ctx_r2.strength >= 8 && ctx_r2.strength < 13, ctx_r2.strength >= 60));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r2.strength === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r2.strength < 8 && ctx_r2.strength > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r2.strength >= 8 && ctx_r2.strength < 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r2.strength >= 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](21, _c2, ctx_r2.isExpanded));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r2("security.password_parameters_title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](23, _c3, ctx_r2.isExpanded));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("innerHTML", t_r2("security.password_parameters"), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeHtml"]);
  }
}
class PasswordStrengthComponent {
  _changeDetectorRef;
  unsubscriber$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__.Subject();
  password$ = new rxjs__WEBPACK_IMPORTED_MODULE_6__.BehaviorSubject("");
  overallScore$ = new rxjs__WEBPACK_IMPORTED_MODULE_6__.BehaviorSubject(0);
  onTouched = () => {};
  onChange = () => {};
  password = "";
  minLength = 8;
  passwordStrength = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
  isExpanded = false;
  constructor(_changeDetectorRef) {
    this._changeDetectorRef = _changeDetectorRef;
    this.setupStrengthCalculations();
  }
  ngOnChanges(changes) {
    if (!changes["password"]) return;
    if (!changes["password"].currentValue) {
      this.overallScore$.next(0);
      this.onChange(0);
      this.passwordStrength.emit(0);
      return;
    }
    this.password$.next(this.password);
  }
  get maxStrength() {
    return 128 / this.minLength + 5;
  }
  get passwordStrengthPercentage() {
    return Math.min(100, Math.ceil(this.overallScore$.value / this.maxStrength * 100));
  }
  get commonPasswords() {
    return _common_password_list__WEBPACK_IMPORTED_MODULE_14__["default"];
  }
  get strength() {
    return this.overallScore$.value;
  }
  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
  setupStrengthCalculations() {
    const debouncedPassword$ = this.password$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_13__.takeUntil)(this.unsubscriber$), (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.debounceTime)(300));
    debouncedPassword$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_13__.takeUntil)(this.unsubscriber$), (0,rxjs__WEBPACK_IMPORTED_MODULE_12__.switchMap)(() => {
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.merge)(this.getBaseStrength$(debouncedPassword$), this.getLengthStrength$(debouncedPassword$), this.getRepeatsStrength$(debouncedPassword$), this.checkCommonPassword$(debouncedPassword$)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_11__.scan)((total, current) => total + current, 0), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.map)(score => Math.max(0, score)), (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.finalize)(() => {
        this.onTouched();
      }));
    })).subscribe({
      next: score => {
        this.overallScore$.next(score);
        this.onChange(score);
        this.passwordStrength.emit(score);
        this._changeDetectorRef.detectChanges();
      }
    });
  }
  getBaseStrength$(password$ = this.password$) {
    return password$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_13__.takeUntil)(this.unsubscriber$), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.map)(password => {
      if (!password) return 0;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChars = /[\p{L}\p{N}\p{P}\p{S}]/u.test(password);
      let strength = 0;
      if (hasUpperCase) strength += 2;
      if (hasLowerCase) strength += 2;
      if (hasNumbers) strength += 2;
      if (hasSpecialChars) strength += 2;
      return strength;
    }));
  }
  getLengthStrength$(password$ = this.password$) {
    return password$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_13__.takeUntil)(this.unsubscriber$), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.map)(password => {
      if (!password) return 0;
      const length = password.length;
      const minLength = this.minLength;
      if (length < minLength) return 0;
      return Math.floor(length / minLength);
    }));
  }
  getRepeatsStrength$(password$ = this.password$) {
    return password$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_13__.takeUntil)(this.unsubscriber$), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.map)(password => {
      if (!password) return 0;
      const repeats = password.match(/(.+)\1+/g);
      if (!repeats) return 0;
      const totalRepeats = repeats.reduce((sum, group) => sum + group.length - 1, 0);
      return Math.ceil(-(totalRepeats / 3));
    }));
  }
  checkCommonPassword$(password$ = this.password$) {
    return password$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_13__.takeUntil)(this.unsubscriber$), (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.map)(password => {
      const commonPassword = this.commonPasswords.find(commonPassword => new RegExp(commonPassword, "i").test(password));
      return commonPassword ? -1 : 0;
    }));
  }
  registerOnChange(fn) {
    this.onChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  writeValue(value) {
    if (value !== undefined && value !== null) {
      this.overallScore$.next(value);
      this._changeDetectorRef.detectChanges();
    }
  }
  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
  static ɵfac = function PasswordStrengthComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || PasswordStrengthComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_15__.ChangeDetectorRef));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: PasswordStrengthComponent,
    selectors: [["password-strength"]],
    inputs: {
      password: "password",
      minLength: "minLength"
    },
    outputs: {
      passwordStrength: "passwordStrength"
    },
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵProvidersFeature"]([{
      provide: _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NG_VALUE_ACCESSOR,
      useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(() => PasswordStrengthComponent),
      multi: true
    }]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵNgOnChangesFeature"]],
    decls: 1,
    vars: 0,
    consts: [["class", "password-strength", 4, "transloco"], [1, "password-strength"], [1, "password-strength__bar-label"], [1, "password-strength__bar-container"], [1, "password-strength__bar", 3, "ngClass"], [1, "password-strength__label", 3, "ngClass"], [4, "ngIf"], [1, "expandable"], [1, "expandable__label", 3, "click", "ngClass"], [1, "expandable__text"], ["width", "12", "height", "8", "viewBox", "0 0 12 8", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M2.1251 6.99953L6.0051 3.11953L9.8851 6.99953C10.2751 7.38953 10.9051 7.38953 11.2951 6.99953C11.6851 6.60953 11.6851 5.97953 11.2951 5.58953L6.7051 0.999531C6.3151 0.609531 5.6851 0.609531 5.2951 0.999531L0.705098 5.58953C0.315098 5.97953 0.315098 6.60953 0.705098 6.99953C1.0951 7.37953 1.7351 7.38953 2.1251 6.99953Z"], [1, "expandable__content", 3, "ngClass"], [1, "expandable__inner-content"], [3, "innerHTML"]],
    template: function PasswordStrengthComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, PasswordStrengthComponent_div_0_Template, 19, 25, "div", 0);
      }
    },
    dependencies: [_jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__.TranslocoDirective, _angular_common__WEBPACK_IMPORTED_MODULE_0__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_0__.NgClass],
    styles: ["[_nghost-%COMP%] {\n  margin-top: calc(16px * var(--zns-space-scale, 1));\n  display: block;\n  width: 100%;\n}\n\n.password-strength[_ngcontent-%COMP%] {\n  width: 100%;\n  box-sizing: border-box;\n  padding: calc(16px * var(--zns-space-scale, 1));\n  border-radius: 16px;\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n}\n.password-strength__bar-label[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 500;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  color: var(--zns-theme-text-secondary, #73777f);\n  margin-bottom: calc(8px * var(--zns-space-scale, 1));\n  margin-top: 0;\n}\n.password-strength__bar-container[_ngcontent-%COMP%] {\n  width: 100%;\n  box-sizing: border-box;\n  border-radius: calc(4px * var(--zns-space-scale, 1));\n  border: 1px solid var(--zns-theme-border-hover, #c3c6cf);\n}\n.password-strength__bar[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  background: var(--zns-theme-card-border, #eeedf1);\n  border-radius: calc(4px * var(--zns-space-scale, 1));\n  transition: width 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  height: calc(8px * var(--zns-space-scale, 1));\n  overflow: hidden;\n  position: relative;\n}\n.password-strength__bar--weak[_ngcontent-%COMP%] {\n  background: var(--zns-theme-error, #dc362e);\n}\n.password-strength__bar--medium[_ngcontent-%COMP%] {\n  background: #3998d3;\n}\n.password-strength__bar--strong[_ngcontent-%COMP%] {\n  background: var(--zns-theme-success, #1ea446);\n}\n.password-strength__label[_ngcontent-%COMP%] {\n  margin-top: calc(8px * var(--zns-space-scale, 1));\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 500;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  text-align: center;\n}\n.password-strength__label--weak[_ngcontent-%COMP%] {\n  color: var(--zns-theme-error, #dc362e);\n}\n.password-strength__label--medium[_ngcontent-%COMP%] {\n  color: #3998d3;\n}\n.password-strength__label--strong[_ngcontent-%COMP%] {\n  color: var(--zns-theme-success, #1ea446);\n}\n\n.expandable[_ngcontent-%COMP%] {\n  margin-top: calc(16px * var(--zns-space-scale, 1));\n  width: 100%;\n  box-sizing: border-box;\n  border-radius: 16px;\n  border: 1px solid var(--zns-theme-border-hover, #c3c6cf);\n}\n.expandable__label[_ngcontent-%COMP%] {\n  min-height: calc(40px * var(--zns-space-scale, 1));\n  box-sizing: border-box;\n  cursor: pointer;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 500;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  text-align: center;\n  vertical-align: middle;\n  color: var(--zns-theme-text-secondary, #73777f);\n  width: 100%;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: calc(8px * var(--zns-space-scale, 1)) calc(24px * var(--zns-space-scale, 1)) calc(8px * var(--zns-space-scale, 1));\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.expandable__label[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n  transition: transform 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.expandable__label--active[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n}\n.expandable__label--active[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transform: rotate(0deg);\n  fill: var(--zns-theme-text, #181818);\n}\n.expandable__text[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.expandable__content[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  overflow: hidden;\n  max-height: 0;\n  transition: max-height 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.expandable__content--active[_ngcontent-%COMP%] {\n  max-height: calc(300px * var(--zns-space-scale, 1));\n}\n.expandable__inner-content[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  padding: 0 calc(24px * var(--zns-space-scale, 1));\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 400;\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  line-height: calc(16px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvcGFzc3dvcmQtc3RyZW5ndGgvcGFzc3dvcmQtc3RyZW5ndGguY29tcG9uZW50LnNjc3MiLCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL192YXJpYWJsZXMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNJLGtEQUFBO0VBQ0EsY0FBQTtFQUNBLFdBQUE7QUFESjs7QUFJQTtFQUNJLFdBQUE7RUFDQSxzQkFBQTtFQUNBLCtDQUFBO0VBQ0EsbUJBQUE7RUFDQSxrREFBQTtBQURKO0FBR0k7RUFDSSx1RUNRVTtFRFBWLGdCQUFBO0VBQ0EsZ0RBQUE7RUFDQSxrREFBQTtFQUNBLHFCQUFBO0VBQ0EsK0NDWWE7RURYYixvREFBQTtFQUNBLGFBQUE7QUFEUjtBQUlJO0VBQ0ksV0FBQTtFQUNBLHNCQUFBO0VBQ0Esb0RBQUE7RUFDQSx3REFBQTtBQUZSO0FBS0k7RUFDSSxzQkFBQTtFQUNBLGlEQ2VVO0VEZFYsb0RBQUE7RUFDQSx1R0FDSTtFQUVKLDZDQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtBQUxSO0FBT1E7RUFDSSwyQ0NwQ0o7QUQrQlI7QUFRUTtFQUNJLG1CQ2hDTDtBRDBCUDtBQVNRO0VBQ0ksNkNDaERGO0FEeUNWO0FBV0k7RUFDSSxpREFBQTtFQUNBLHVFQ25DVTtFRG9DVixnQkFBQTtFQUNBLGdEQUFBO0VBQ0Esa0RBQUE7RUFDQSxxQkFBQTtFQUNBLGtCQUFBO0FBVFI7QUFXUTtFQUNJLHNDQzFESjtBRGlEUjtBQVlRO0VBQ0ksY0N0REw7QUQ0Q1A7QUFhUTtFQUNJLHdDQ3RFRjtBRDJEVjs7QUFnQkE7RUFDSSxrREFBQTtFQUNBLFdBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0VBQ0Esd0RBQUE7QUFiSjtBQWVJO0VBQ0ksa0RBQUE7RUFDQSxzQkFBQTtFQUNBLGVBQUE7RUFDQSx1RUNuRVU7RURvRVYsZ0JBQUE7RUFDQSxnREFBQTtFQUNBLGtEQUFBO0VBQ0EscUJBQUE7RUFDQSxrQkFBQTtFQUNBLHNCQUFBO0VBQ0EsK0NDakVhO0VEa0ViLFdBQUE7RUFDQSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtFQUNBLDJIQUFBO0VBQ0Esc0RBQUE7QUFiUjtBQWVRO0VBQ0kseUJBQUE7RUFDQSwwREFBQTtFQUNBLDhDQzVFUztBRCtEckI7QUFnQlE7RUFDSSxxQ0NsRkE7QURvRVo7QUFnQlk7RUFDSSx1QkFBQTtFQUNBLG9DQ3RGSjtBRHdFWjtBQW1CSTtFQUNJLFNBQUE7QUFqQlI7QUFvQkk7RUFDSSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsYUFBQTtFQUNBLDJEQUFBO0FBbEJSO0FBb0JRO0VBQ0ksbURBQUE7QUFsQlo7QUFzQkk7RUFDSSxzQkFBQTtFQUNBLGlEQUFBO0VBQ0EsdUVDcEhVO0VEcUhWLGdCQUFBO0VBQ0EsZ0RBQUE7RUFDQSxrREFBQTtFQUNBLHFCQUFBO0FBcEJSIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcIi4uLy4uL3N0eWxlcy92YXJpYWJsZXNcIjtcblxuOmhvc3Qge1xuICAgIG1hcmdpbi10b3A6IGNhbGMoMTZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIHdpZHRoOiAxMDAlO1xufVxuXG4ucGFzc3dvcmQtc3RyZW5ndGgge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgcGFkZGluZzogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyO1xuXG4gICAgJl9fYmFyLWxhYmVsIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDIwcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xcHg7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgbWFyZ2luLXRvcDogMDtcbiAgICB9XG5cbiAgICAmX19iYXItY29udGFpbmVyIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IGNhbGMoNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICB9XG5cbiAgICAmX19iYXIge1xuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogY2FsYyg0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIHdpZHRoIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgICAgIGhlaWdodDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICAgICAgICYtLXdlYWsge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiRlcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgICYtLW1lZGl1bSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJGluZm87XG4gICAgICAgIH1cblxuICAgICAgICAmLS1zdHJvbmcge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiRjb3JyZWN0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fbGFiZWwge1xuICAgICAgICBtYXJnaW4tdG9wOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMjBweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjFweDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuXG4gICAgICAgICYtLXdlYWsge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICAmLS1tZWRpdW0ge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kaW5mbztcbiAgICAgICAgfVxuXG4gICAgICAgICYtLXN0cm9uZyB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRjb3JyZWN0O1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uZXhwYW5kYWJsZSB7XG4gICAgbWFyZ2luLXRvcDogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcblxuICAgICZfX2xhYmVsIHtcbiAgICAgICAgbWluLWhlaWdodDogY2FsYyg0MHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDIwcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xcHg7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpIGNhbGMoMjRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpIGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDE4MGRlZyk7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgJi0tYWN0aXZlIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3RleHQge1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgfVxuXG4gICAgJl9fY29udGVudCB7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIG1heC1oZWlnaHQ6IDA7XG4gICAgICAgIHRyYW5zaXRpb246IG1heC1oZWlnaHQgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmLS1hY3RpdmUge1xuICAgICAgICAgICAgbWF4LWhlaWdodDogY2FsYygzMDBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9faW5uZXItY29udGVudCB7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgIHBhZGRpbmc6IDAgY2FsYygyNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEycHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygxNnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMXB4O1xuICAgIH1cbn1cbiIsIiRwcmltYXJ5Q29sb3I6IHZhcigtLXpucy10aGVtZS1wcmltYXJ5LCAjMTgxODE4KTtcbiRwcmltYXJ5TGlnaHQ6ICNkYWRkZmE7XG4kc2Vjb25kYXJ5Q29sb3I6IHZhcigtLXpucy10aGVtZS1zZWNvbmRhcnksICNmZjU3MjEpO1xuJHNlY29uZGFyeUNvbG9yTGlnaHQ6ICNmNmU1ZTA7XG5cbiRjb3JyZWN0OiB2YXIoLS16bnMtdGhlbWUtc3VjY2VzcywgIzFlYTQ0Nik7XG4kY29ycmVjdERhcms6ICMwZjUyMjM7XG4kY29ycmVjdExpZ2h0OiB2YXIoLS16bnMtdGhlbWUtc3VjY2Vzcy10ZXh0LCAjZTdmOGVkKTtcblxuJGVycm9yOiB2YXIoLS16bnMtdGhlbWUtZXJyb3IsICNkYzM2MmUpO1xuJGVycm9yRGFyazogIzYwMTQxMDtcbiRlcnJvckxpZ2h0OiB2YXIoLS16bnMtdGhlbWUtZXJyb3ItdGV4dCwgI2ZjZWVlZSk7XG5cbiR3YXJuaW5nOiB2YXIoLS16bnMtdGhlbWUtd2FybmluZywgI2RlNjgwMCk7XG4kd2FybmluZ0Rhcms6ICM0YTIxMGE7XG4kd2FybmluZ0xpZ2h0OiB2YXIoLS16bnMtdGhlbWUtd2FybmluZy10ZXh0LCAjZmZlZWU5KTtcblxuJGluZm86ICMzOTk4ZDM7XG4kaW5mb0Rhcms6ICMwMDRhNzc7XG4kaW5mb0xpZ2h0OiAjZWNmM2ZlO1xuXG4kYmxhY2s6ICMxODE4MTg7XG4kd2hpdGU6ICNmZmZmZmY7XG5cbiR0aGVtZUJvZHlGYW1pbHk6IHZhcigtLXpucy10aGVtZS1ib2R5LWZhbWlseSwgXCJQb3BwaW5zXCIsIEFyaWFsLCBzYW5zLXNlcmlmKTtcbiR0aGVtZVRpdGxlRmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtdGl0bGUtZmFtaWx5LCBcIk1lbmRhXCIsIFwiQXJpYWwgQmxhY2tcIiwgc2Fucy1zZXJpZik7XG4kdGhlbWVNb25vc3BhY2VGYW1pbHk6IHZhcigtLXpucy10aGVtZS1tb25vc3BhY2UtZmFtaWx5LCBcIkNvdXJpZXIgTmV3XCIsIENvdXJpZXIsIG1vbm9zcGFjZSk7XG5cbiR0aGVtZUJhY2tncm91bmQ6IHZhcigtLXpucy10aGVtZS1iYWNrZ3JvdW5kLCAjZmZmZmZmKTtcbiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS1iYWNrZ3JvdW5kLXNlY29uZGFyeSwgI2Y5ZjlmYyk7XG5cbiR0aGVtZVRleHQ6IHZhcigtLXpucy10aGVtZS10ZXh0LCAjMTgxODE4KTtcbiR0aGVtZVRleHRNdXRlZDogdmFyKC0tem5zLXRoZW1lLXRleHQtbXV0ZWQsICM5NjkzOWUpO1xuJHRoZW1lVGV4dFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLXRleHQtc2Vjb25kYXJ5LCAjNzM3NzdmKTtcblxuJHRoZW1lSGVhZGVyOiB2YXIoLS16bnMtdGhlbWUtaGVhZGVyLCAjMTgxODE4KTtcbiR0aGVtZUhlYWRlclRleHQ6IHZhcigtLXpucy10aGVtZS1oZWFkZXItdGV4dCwgI2ZmZmZmZik7XG5cbiR0aGVtZUJ1dHRvbjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbiwgIzE4MTgxOCk7XG4kdGhlbWVCdXR0b25UZXh0OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXRleHQsICNmZmZmZmYpO1xuJHRoZW1lQnV0dG9uSG92ZXI6IHZhcigtLXpucy10aGVtZS1idXR0b24taG92ZXIsICNmZjU3MjEpO1xuXG4kdGhlbWVCdXR0b25TZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LCAjZTllY2VmKTtcbiR0aGVtZUJ1dHRvblNlY29uZGFyeVRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LXRleHQsICM0OTUwNTcpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5SG92ZXI6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LWhvdmVyLCAjZTllY2VmKTtcblxuJHRoZW1lQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtYm9yZGVyLCAjZTNlM2UzKTtcbiR0aGVtZUJvcmRlckhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYm9yZGVyLWhvdmVyLCAjYzNjNmNmKTtcblxuJHRoZW1lQ2FyZDogdmFyKC0tem5zLXRoZW1lLWNhcmQsICNmZmZmZmYpO1xuJHRoZW1lQ2FyZEJvcmRlcjogdmFyKC0tem5zLXRoZW1lLWNhcmQtYm9yZGVyLCAjZWVlZGYxKTtcblxuJHRoZW1lU2hhZG93OiB2YXIoLS16bnMtdGhlbWUtc2hhZG93LCByZ2JhKDAsIDAsIDAsIDAuMSkpO1xuXG4kc21vb3RoQmV6aWVyOiBjdWJpYy1iZXppZXIoMC4yNSwgMC40LCAwLjcsIDEpO1xuXG4kbWF4RXh0cmFTbWFsbDogNTk1cHg7XG4kbWluU21hbGw6IDYwMHB4O1xuJG1lZGl1bTogNzY4cHg7XG4kbGFyZ2U6IDg4OXB4O1xuJGNvbXB1dGVyczogMTIwMHB4O1xuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ },

/***/ 95212
/*!******************************************************************!*\
  !*** ./src/app/security-password/security-password.component.ts ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SecurityPasswordComponent: () => (/* binding */ SecurityPasswordComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 52575);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 33900);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 34487);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var app_password_strength_password_strength_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! app/password-strength/password-strength.component */ 98388);
/* harmony import */ var app_tags_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! app/tags.service */ 73768);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var app_captcha_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! app/captcha.service */ 29569);
/* harmony import */ var app_chrome_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! app/chrome.service */ 85043);
/* harmony import */ var app_vault_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! app/vault.service */ 19519);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/button */ 69885);



















const _c0 = a0 => ({
  "security-password__option-wrapper--hidden": a0
});
const _c1 = a0 => ({
  "security-password__option-card--selected": a0
});
const _c2 = a0 => ({
  "security-password__radio-button--selected": a0
});
const _c3 = a0 => ({
  "security-password__inline-form--visible": a0
});
const _c4 = a0 => ({
  "zelf-input--error": a0
});
function SecurityPasswordComponent_div_0_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "h2", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "p", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](ctx_r1.isPinUnlock ? t_r3("security.pin_title") : t_r3("security.password_decryption"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](ctx_r1.isPinUnlock ? t_r3("security.pin_description") : t_r3("security.password_subtitle"));
  }
}
function SecurityPasswordComponent_div_0_ng_container_7__svg_svg_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "svg", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](1, "path", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
}
function SecurityPasswordComponent_div_0_ng_container_7_ng_container_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainer"](0);
  }
}
function SecurityPasswordComponent_div_0_ng_container_7_ng_container_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainer"](0);
  }
}
function SecurityPasswordComponent_div_0_ng_container_7_ng_container_35_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainer"](0);
  }
}
function SecurityPasswordComponent_div_0_ng_container_7_ng_container_35_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](2, SecurityPasswordComponent_div_0_ng_container_7_ng_container_35_ng_container_2_Template, 1, 0, "ng-container", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    const cross_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵreference"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngTemplateOutlet", cross_r5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r3("errors.all_fields_required"));
  }
}
function SecurityPasswordComponent_div_0_ng_container_7_ng_container_36_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainer"](0);
  }
}
function SecurityPasswordComponent_div_0_ng_container_7_ng_container_36_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](2, SecurityPasswordComponent_div_0_ng_container_7_ng_container_36_ng_container_2_Template, 1, 0, "ng-container", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    const cross_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵreference"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngTemplateOutlet", cross_r5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r3("errors.password_doesnt_match"));
  }
}
function SecurityPasswordComponent_div_0_ng_container_7__svg_svg_47_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "svg", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](1, "path", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
}
function SecurityPasswordComponent_div_0_ng_container_7_div_53_input_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "input", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("input", function SecurityPasswordComponent_div_0_ng_container_7_div_53_input_2_Template_input_input_0_listener($event) {
      const i_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r7).index;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.onPinInput($event, i_r8, false));
    })("keydown", function SecurityPasswordComponent_div_0_ng_container_7_div_53_input_2_Template_input_keydown_0_listener($event) {
      const i_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r7).index;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.onPinKeyDown($event, i_r8, false));
    })("focus", function SecurityPasswordComponent_div_0_ng_container_7_div_53_input_2_Template_input_focus_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.onInputFocus($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const digit_r9 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("type", ctx_r1.showPin ? "text" : "password")("value", digit_r9);
  }
}
function SecurityPasswordComponent_div_0_ng_container_7_div_53__svg_svg_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "svg", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](1, "path", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
}
function SecurityPasswordComponent_div_0_ng_container_7_div_53__svg_svg_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "svg", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](1, "path", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
}
function SecurityPasswordComponent_div_0_ng_container_7_div_53_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 48)(1, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](2, SecurityPasswordComponent_div_0_ng_container_7_div_53_input_2_Template, 1, 2, "input", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "button", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function SecurityPasswordComponent_div_0_ng_container_7_div_53_Template_button_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.toggleShowPin());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](4, SecurityPasswordComponent_div_0_ng_container_7_div_53__svg_svg_4_Template, 2, 0, "svg", 52)(5, SecurityPasswordComponent_div_0_ng_container_7_div_53__svg_svg_5_Template, 2, 0, "svg", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngForOf", ctx_r1.pinDigits)("ngForTrackBy", ctx_r1.trackByIndex);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵattribute"]("aria-label", ctx_r1.showPin ? "Hide PIN" : "Show PIN");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !ctx_r1.showPin);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r1.showPin);
  }
}
function SecurityPasswordComponent_div_0_ng_container_7_div_54_input_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "input", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("input", function SecurityPasswordComponent_div_0_ng_container_7_div_54_input_2_Template_input_input_0_listener($event) {
      const i_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r11).index;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.onPinInput($event, i_r12, true));
    })("keydown", function SecurityPasswordComponent_div_0_ng_container_7_div_54_input_2_Template_input_keydown_0_listener($event) {
      const i_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r11).index;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.onPinKeyDown($event, i_r12, true));
    })("focus", function SecurityPasswordComponent_div_0_ng_container_7_div_54_input_2_Template_input_focus_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r11);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.onInputFocus($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const digit_r13 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("type", ctx_r1.showConfirmPin ? "text" : "password")("value", digit_r13);
  }
}
function SecurityPasswordComponent_div_0_ng_container_7_div_54__svg_svg_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "svg", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](1, "path", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
}
function SecurityPasswordComponent_div_0_ng_container_7_div_54__svg_svg_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "svg", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](1, "path", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
}
function SecurityPasswordComponent_div_0_ng_container_7_div_54_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 48)(1, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](2, SecurityPasswordComponent_div_0_ng_container_7_div_54_input_2_Template, 1, 2, "input", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "button", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function SecurityPasswordComponent_div_0_ng_container_7_div_54_Template_button_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r10);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.toggleShowConfirmPin());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](4, SecurityPasswordComponent_div_0_ng_container_7_div_54__svg_svg_4_Template, 2, 0, "svg", 52)(5, SecurityPasswordComponent_div_0_ng_container_7_div_54__svg_svg_5_Template, 2, 0, "svg", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngForOf", ctx_r1.confirmPinDigits)("ngForTrackBy", ctx_r1.trackByIndex);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵattribute"]("aria-label", ctx_r1.showConfirmPin ? "Hide PIN" : "Show PIN");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !ctx_r1.showConfirmPin);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r1.showConfirmPin);
  }
}
function SecurityPasswordComponent_div_0_ng_container_7__svg_svg_65_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "svg", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](1, "path", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
}
function SecurityPasswordComponent_div_0_ng_container_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "div", 14)(2, "div", 15)(3, "div", 16)(4, "h2", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](6, "p", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](8, "div", 19)(9, "div", 20)(10, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function SecurityPasswordComponent_div_0_ng_container_7_Template_div_click_10_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.selectSecurityOption("securePassword"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](11, "div", 22)(12, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](14, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](16, "div", 25)(17, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](18, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](19, SecurityPasswordComponent_div_0_ng_container_7__svg_svg_19_Template, 2, 0, "svg", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](20, "div", 29)(21, "form", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("ngSubmit", function SecurityPasswordComponent_div_0_ng_container_7_Template_form_ngSubmit_21_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.storePassword());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](22, "div", 31)(23, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](24, "input", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](25, "label", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](26);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](27, SecurityPasswordComponent_div_0_ng_container_7_ng_container_27_Template, 1, 0, "ng-container", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](28, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](29, "input", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](30, "label", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](31);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](32, SecurityPasswordComponent_div_0_ng_container_7_ng_container_32_Template, 1, 0, "ng-container", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](33, "password-strength", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](34, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](35, SecurityPasswordComponent_div_0_ng_container_7_ng_container_35_Template, 5, 2, "ng-container", 11)(36, SecurityPasswordComponent_div_0_ng_container_7_ng_container_36_Template, 5, 2, "ng-container", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](37, "div", 20)(38, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function SecurityPasswordComponent_div_0_ng_container_7_Template_div_click_38_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.selectSecurityOption("pin"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](39, "div", 22)(40, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](41);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](42, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](43);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](44, "div", 25)(45, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](46, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](47, SecurityPasswordComponent_div_0_ng_container_7__svg_svg_47_Template, 2, 0, "svg", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](48, "div", 29)(49, "div", 31)(50, "p", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](51);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](52, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](53, SecurityPasswordComponent_div_0_ng_container_7_div_53_Template, 6, 5, "div", 42)(54, SecurityPasswordComponent_div_0_ng_container_7_div_54_Template, 6, 5, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](55, "div", 20)(56, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function SecurityPasswordComponent_div_0_ng_container_7_Template_div_click_56_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.selectSecurityOption("withoutPassword"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](57, "div", 22)(58, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](59);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](60, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](61);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](62, "div", 25)(63, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](64, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](65, SecurityPasswordComponent_div_0_ng_container_7__svg_svg_65_Template, 2, 0, "svg", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](66, "div", 43)(67, "button", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function SecurityPasswordComponent_div_0_ng_container_7_Template_button_click_67_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.continueWithSelection());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](68);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    let tmp_17_0;
    let tmp_21_0;
    let tmp_25_0;
    let tmp_26_0;
    let tmp_27_0;
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    const toggleButton_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵreference"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r3("security.security_layer_title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r3("security.security_layer_subtitle"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](39, _c0, ctx_r1.selectedSecurityOption && ctx_r1.selectedSecurityOption !== "securePassword"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](41, _c1, ctx_r1.selectedSecurityOption === "securePassword"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r3("security.secure_password_title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r3("security.secure_password_description"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](43, _c2, ctx_r1.selectedSecurityOption === "securePassword"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r1.selectedSecurityOption === "securePassword");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](45, _c3, ctx_r1.selectedSecurityOption === "securePassword"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("formGroup", ctx_r1.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](47, _c4, ((tmp_17_0 = ctx_r1.form.get("password")) == null ? null : tmp_17_0.dirty) && ((tmp_17_0 = ctx_r1.form.get("password")) == null ? null : tmp_17_0.errors)));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("type", ctx_r1.showPassword ? "text" : "password");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r3("common.password"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngTemplateOutlet", toggleButton_r14);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](49, _c4, ((tmp_21_0 = ctx_r1.form.get("confirmPassword")) == null ? null : tmp_21_0.dirty) && ((tmp_21_0 = ctx_r1.form.get("confirmPassword")) == null ? null : tmp_21_0.errors)));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("type", ctx_r1.showPassword ? "text" : "password");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r3("common.confirm_password"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngTemplateOutlet", toggleButton_r14);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("password", (tmp_25_0 = ctx_r1.form.get("password")) == null ? null : tmp_25_0.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ((tmp_26_0 = ctx_r1.form.get("password")) == null ? null : tmp_26_0.dirty) && ((tmp_26_0 = ctx_r1.form.get("password")) == null ? null : tmp_26_0.errors == null ? null : tmp_26_0.errors.required) || ((tmp_26_0 = ctx_r1.form.get("confirmPassword")) == null ? null : tmp_26_0.dirty) && ((tmp_26_0 = ctx_r1.form.get("confirmPassword")) == null ? null : tmp_26_0.errors == null ? null : tmp_26_0.errors.required));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", (tmp_27_0 = ctx_r1.form.get("confirmPassword")) == null ? null : tmp_27_0.errors == null ? null : tmp_27_0.errors.compareTo);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](51, _c0, ctx_r1.selectedSecurityOption && ctx_r1.selectedSecurityOption !== "pin"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](53, _c1, ctx_r1.selectedSecurityOption === "pin"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r3("security.pin_title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r3("security.pin_description"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](55, _c2, ctx_r1.selectedSecurityOption === "pin"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r1.selectedSecurityOption === "pin");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](57, _c3, ctx_r1.selectedSecurityOption === "pin"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", ctx_r1.pinStep === "create" || !ctx_r1.pinStep ? t_r3("security.pin_description") : t_r3("security.pin_confirm_description"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r1.pinStep === "create" || !ctx_r1.pinStep);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r1.pinStep === "confirm");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](59, _c0, ctx_r1.selectedSecurityOption && ctx_r1.selectedSecurityOption !== "withoutPassword"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](61, _c1, ctx_r1.selectedSecurityOption === "withoutPassword"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r3("security.without_password_title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r3("security.without_password_description"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](63, _c2, ctx_r1.selectedSecurityOption === "withoutPassword"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r1.selectedSecurityOption === "withoutPassword");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("disabled", !ctx_r1.selectedSecurityOption || ctx_r1.selectedSecurityOption === "securePassword" && ctx_r1.form.invalid || ctx_r1.selectedSecurityOption === "pin" && !ctx_r1.canContinuePin());
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", ctx_r1.selectedSecurityOption === "pin" && ctx_r1.pinStep === "create" ? t_r3("common.next") : t_r3("common.continue"), " ");
  }
}
function SecurityPasswordComponent_div_0_ng_container_8_ng_container_3_input_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "input", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("input", function SecurityPasswordComponent_div_0_ng_container_8_ng_container_3_input_4_Template_input_input_0_listener($event) {
      const i_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r16).index;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.onPinInput($event, i_r17, false));
    })("keydown", function SecurityPasswordComponent_div_0_ng_container_8_ng_container_3_input_4_Template_input_keydown_0_listener($event) {
      const i_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r16).index;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.onPinKeyDown($event, i_r17, false));
    })("focus", function SecurityPasswordComponent_div_0_ng_container_8_ng_container_3_input_4_Template_input_focus_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r16);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.onInputFocus($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const digit_r18 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("value", digit_r18);
  }
}
function SecurityPasswordComponent_div_0_ng_container_8_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "div", 41)(2, "div", 48)(3, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](4, SecurityPasswordComponent_div_0_ng_container_8_ng_container_3_input_4_Template, 1, 1, "input", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngForOf", ctx_r1.pinDigits)("ngForTrackBy", ctx_r1.trackByIndex);
  }
}
function SecurityPasswordComponent_div_0_ng_container_8_div_4_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainer"](0);
  }
}
function SecurityPasswordComponent_div_0_ng_container_8_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](1, "input", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](2, "label", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](4, SecurityPasswordComponent_div_0_ng_container_8_div_4_ng_container_4_Template, 1, 0, "ng-container", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    let tmp_8_0;
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    const toggleButton_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵreference"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](4, _c4, ((tmp_8_0 = ctx_r1.form.get("password")) == null ? null : tmp_8_0.dirty) && ((tmp_8_0 = ctx_r1.form.get("password")) == null ? null : tmp_8_0.errors)));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("type", ctx_r1.showPassword ? "text" : "password");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r3("common.password"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngTemplateOutlet", toggleButton_r14);
  }
}
function SecurityPasswordComponent_div_0_ng_container_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "form", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("ngSubmit", function SecurityPasswordComponent_div_0_ng_container_8_Template_form_ngSubmit_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r15);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.storePassword());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](2, "div", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](3, SecurityPasswordComponent_div_0_ng_container_8_ng_container_3_Template, 5, 2, "ng-container", 11)(4, SecurityPasswordComponent_div_0_ng_container_8_div_4_Template, 5, 6, "div", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](5, "div", 62)(6, "button", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("formGroup", ctx_r1.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r1.isPinUnlock);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !ctx_r1.isPinUnlock);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("disabled", ctx_r1.isPinUnlock && ctx_r1.pinDigits.join("").length !== 6 || !ctx_r1.isPinUnlock && ctx_r1.form.invalid);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", t_r3("common.confirm_password"), " ");
  }
}
function SecurityPasswordComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 5)(1, "div", 6)(2, "div", 7)(3, "button", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function SecurityPasswordComponent_div_0_Template_button_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.goBack());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](4, "svg", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](5, "path", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](6, SecurityPasswordComponent_div_0_ng_container_6_Template, 5, 2, "ng-container", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](7, SecurityPasswordComponent_div_0_ng_container_7_Template, 69, 65, "ng-container", 11)(8, SecurityPasswordComponent_div_0_ng_container_8_Template, 8, 5, "ng-container", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !ctx_r1.isNew);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r1.isNew);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !ctx_r1.isNew);
  }
}
function SecurityPasswordComponent_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "svg", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](1, "path", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
}
function SecurityPasswordComponent_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "svg", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](1, "path", 69)(2, "circle", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
}
function SecurityPasswordComponent_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "svg", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](1, "path", 71)(2, "line", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
}
function SecurityPasswordComponent_ng_template_7_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainer"](0);
  }
}
function SecurityPasswordComponent_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "button", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function SecurityPasswordComponent_ng_template_7_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r19);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r1.toggleShowPassword());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](1, SecurityPasswordComponent_ng_template_7_ng_container_1_Template, 1, 0, "ng-container", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    const openEye_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵreference"](4);
    const closedEye_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵreference"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngTemplateOutlet", ctx_r1.showPassword ? openEye_r20 : closedEye_r21);
  }
}
class SecurityPasswordComponent {
  _activatedRoute;
  _captchaService;
  _chromeService;
  _formBuilder;
  _router;
  _tagsService;
  _vaultService;
  unsubscriber$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
  form;
  flow = "";
  isNew = false;
  returnState = "";
  showPassword = false;
  tagName = "";
  domain = "";
  tagModel = new app_tags_service__WEBPACK_IMPORTED_MODULE_10__.TagModel();
  tagResponse;
  selectedSecurityOption = null;
  pinStep = null;
  pinDigits = ["", "", "", "", "", ""];
  confirmPinDigits = ["", "", "", "", "", ""];
  pinInputs = [];
  showPin = false;
  showConfirmPin = false;
  isPinUnlock = false;
  onInputFocus(event) {
    event.target.select();
  }
  constructor(_activatedRoute, _captchaService, _chromeService, _formBuilder, _router, _tagsService, _vaultService) {
    var _this = this;
    this._activatedRoute = _activatedRoute;
    this._captchaService = _captchaService;
    this._chromeService = _chromeService;
    this._formBuilder = _formBuilder;
    this._router = _router;
    this._tagsService = _tagsService;
    this._vaultService = _vaultService;
    this._vaultService.password = "";
    this._initForm();
    this._activatedRoute.snapshot.queryParams?.return && (this.returnState = this._activatedRoute.snapshot.queryParams.return);
    this._activatedRoute.queryParams.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.takeUntil)(this.unsubscriber$)).subscribe(/*#__PURE__*/function () {
      var _ref = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (params) {
        params?.return && (_this.returnState = params.return);
      });
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  }
  ngOnInit() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this2.flow = yield _this2._tagsService.getFlow();
      _this2.tagName = (yield _this2._tagsService.getTagName()) || (yield _this2._tagsService.getNewTagName());
      _this2.domain = yield _this2._tagsService.getDomain();
      _this2.tagModel = yield _this2._tagsService.getTagNameObject();
      _this2.tagResponse = yield _this2._tagsService.getTagResponse();
      _this2.isNew = _this2.flow === "create" || _this2.flow === "import" || _this2.flow === "recover" && !_this2.tagModel?.available;
      // Security Type Detection for Unlock Flow
      if (!_this2.isNew && _this2.tagModel?.publicData) {
        const publicData = _this2.tagModel.publicData;
        // Handle No Password
        if (String(publicData.hasPassword) === "false") {
          _this2._vaultService.password = "NO_PASSWORD_PLACEHOLDER";
          _this2._vaultService.securityType = "withoutPassword";
          _this2._chromeService.setItem("noPasswordRequired", "true");
          _this2._navigateToBiometrics();
          return;
        }
        // Handle PIN
        if (publicData.st === "pin") {
          _this2.isPinUnlock = true;
          _this2.pinDigits = ["", "", "", "", "", ""];
        }
      }
      _this2._initForm();
    })();
  }
  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
  _compareToValidator(matchTo) {
    return control => {
      return control.value !== control.parent?.get(matchTo)?.value ? {
        compareTo: true
      } : null;
    };
  }
  _generateCaptcha() {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this3._chromeService.isExtension) return;
      const generateCaptchaNow = yield _this3._chromeService.getItem("hideBiometricsMessage");
      if (!generateCaptchaNow) return;
      const tagName = yield _this3._tagsService.getTagName();
      try {
        const captchaKey = tagName.split(".zelf")[0].replace(".", "_");
        const captchaToken = yield _this3._captchaService.executeRecaptcha(captchaKey);
        _this3._captchaService.retainCaptchaToken(captchaToken);
      } catch (error) {
        console.error("reCAPTCHA failed:", {
          error
        });
      }
    })();
  }
  _initForm() {
    if (!this.isNew) {
      if (this.isPinUnlock) {
        // For PIN unlock, we don't need the password form validator
        this.form = this._formBuilder.group({});
      } else {
        this.form = this._formBuilder.group({
          password: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required]]
        });
      }
      return;
    }
    this.form = this._formBuilder.group({
      password: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.minLength(8)]],
      confirmPassword: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, this._compareToValidator("password")]],
      passwordStrength: [0, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.min(1)]]
    });
    this.form.valueChanges.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.takeUntil)(this.unsubscriber$), (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.debounceTime)(500)).subscribe(() => {
      if (!this.form.get("confirmPassword")?.dirty) return;
      this.form.get("confirmPassword")?.updateValueAndValidity();
    });
  }
  goBack() {
    if (this.returnState) {
      this._router.navigate([this.returnState], {
        queryParams: {
          return: this.returnState
        }
      });
    } else {
      if (this.flow === "create") this._router.navigate(["../"], {
        relativeTo: this._activatedRoute
      });else if (this.flow === "import") this._router.navigate(["/welcome/import"]);else if (this.flow === "unlock") this._router.navigate(["/welcome/registered"]);else this._router.navigate(["/welcome/registered"]);
    }
  }
  storePassword() {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this4.isPinUnlock) {
        const pin = _this4.pinDigits.join("").trim();
        if (pin.length !== 6) return;
        _this4._vaultService.password = pin;
        _this4._vaultService.securityType = "pin";
      } else {
        if (_this4.form.invalid) return;
        _this4._vaultService.password = _this4.form.get("password")?.value.trim();
        _this4._vaultService.securityType = "securePassword";
      }
      yield _this4._generateCaptcha();
      _this4._router.navigate(["/security/biometrics"], {
        queryParams: {
          return: _this4.returnState
        }
      });
    })();
  }
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  toggleShowPin() {
    this.showPin = !this.showPin;
  }
  toggleShowConfirmPin() {
    this.showConfirmPin = !this.showConfirmPin;
  }
  selectSecurityOption(option) {
    // Toggle: if clicking the same option, unselect it
    if (this.selectedSecurityOption === option) {
      this.selectedSecurityOption = null;
      this.pinStep = null;
    } else {
      this.selectedSecurityOption = option;
      if (option === "pin") {
        this.pinStep = "create";
        this.pinDigits = ["", "", "", "", "", ""];
        this.confirmPinDigits = ["", "", "", "", "", ""];
      } else {
        this.pinStep = null;
      }
    }
  }
  continueWithSelection() {
    if (!this.selectedSecurityOption) return;
    if (this.selectedSecurityOption === "securePassword") {
      // Validate form before continuing
      if (this.form.invalid) return;
      // Store password and security type, then navigate to biometrics
      this._vaultService.password = this.form.get("password")?.value.trim();
      this._vaultService.securityType = "securePassword";
      this._navigateToBiometrics();
    } else if (this.selectedSecurityOption === "pin") {
      // Handle PIN multi-step flow
      if (this.pinStep === "create") {
        if (this.canContinuePin()) {
          this.pinStep = "confirm";
          this.confirmPinDigits = ["", "", "", "", "", ""];
          // Focus first confirm input
          setTimeout(() => {
            const inputs = this._getConfirmInputs();
            if (inputs[0]) inputs[0].focus();
          }, 0);
        }
      } else if (this.pinStep === "confirm") {
        if (this.canContinuePin()) {
          // PIN confirmed, save and continue
          const pin = this.pinDigits.join("").trim();
          this._vaultService.password = pin;
          this._vaultService.securityType = "pin";
          this._navigateToBiometrics();
        }
      }
    } else if (this.selectedSecurityOption === "withoutPassword") {
      // Skip password, mark as no password required and go to biometrics
      // Set a placeholder password to satisfy any validation that expects a password field
      // The backend will ignore this based on securityType = "withoutPassword"
      this._vaultService.password = "NO_PASSWORD_PLACEHOLDER";
      this._vaultService.securityType = "withoutPassword";
      this._chromeService.setItem("noPasswordRequired", "true");
      this._navigateToBiometrics();
    }
  }
  _navigateToBiometrics() {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this5._generateCaptcha();
      _this5._router.navigate(["/security/biometrics"], {
        queryParams: {
          return: _this5.returnState
        }
      });
    })();
  }
  onPinInput(event, index, isConfirm = false) {
    const input = event.target;
    const value = input.value; // Allow any character as requested (letters or numbers)
    if (value.length > 1) {
      // If multiple digits pasted, handle accordingly
      const digits = value.slice(0, 6).split("");
      if (isConfirm) {
        this.confirmPinDigits = [...digits, ...Array(6 - digits.length).fill("")].slice(0, 6);
      } else {
        this.pinDigits = [...digits, ...Array(6 - digits.length).fill("")].slice(0, 6);
      }
      // Focus the last filled input or the next empty one
      const lastIndex = Math.min(digits.length - 1, 5);
      setTimeout(() => {
        const inputs = isConfirm ? this._getConfirmInputs() : this._getPinInputs();
        if (inputs[lastIndex]) inputs[lastIndex].focus();
      }, 0);
      return;
    }
    if (isConfirm) {
      this.confirmPinDigits[index] = value;
    } else {
      this.pinDigits[index] = value;
    }
    // Move to next input if value entered
    if (value && index < 5) {
      setTimeout(() => {
        const inputs = isConfirm ? this._getConfirmInputs() : this._getPinInputs();
        if (inputs[index + 1]) inputs[index + 1].focus();
      }, 0);
    }
  }
  onPinKeyDown(event, index, isConfirm = false) {
    const input = event.target;
    if (event.key === "Enter" || event.key === "NumpadEnter") {
      if (this.isPinUnlock) {
        if (this.pinDigits.join("").trim().length === 6) {
          event.preventDefault();
          void this.storePassword();
        }
        return;
      }
      if (this.selectedSecurityOption === "pin" && this.canContinuePin()) {
        event.preventDefault();
        this.continueWithSelection();
      }
      return;
    }
    if (event.key === "Backspace" && !input.value && index > 0) {
      // Move to previous input on backspace if current is empty
      setTimeout(() => {
        const inputs = isConfirm ? this._getConfirmInputs() : this._getPinInputs();
        if (inputs[index - 1]) {
          inputs[index - 1].focus();
          if (isConfirm) {
            this.confirmPinDigits[index - 1] = "";
          } else {
            this.pinDigits[index - 1] = "";
          }
        }
      }, 0);
    }
  }
  _getPinInputs() {
    return Array.from(document.querySelectorAll(".security-password__pin-input"));
  }
  _getConfirmInputs() {
    return Array.from(document.querySelectorAll(".security-password__pin-confirm-input"));
  }
  canContinuePin() {
    if (this.pinStep === "create") {
      return this.pinDigits.every(digit => digit !== "") && this.pinDigits.length === 6;
    } else if (this.pinStep === "confirm") {
      return this.confirmPinDigits.every(digit => digit !== "") && this.confirmPinDigits.length === 6 && this.confirmPinDigits.join("") === this.pinDigits.join("");
    }
    return false;
  }
  continuePin() {
    if (this.pinStep === "create") {
      if (this.canContinuePin()) {
        this.pinStep = "confirm";
        this.confirmPinDigits = ["", "", "", "", "", ""];
        // Focus first confirm input
        setTimeout(() => {
          const inputs = this._getConfirmInputs();
          if (inputs[0]) inputs[0].focus();
        }, 0);
      }
    } else if (this.pinStep === "confirm") {
      if (this.canContinuePin()) {
        // PIN confirmed, save and continue
        const pin = this.pinDigits.join("").trim();
        this._vaultService.password = pin;
        this._navigateToBiometrics();
      }
    }
  }
  goBackFromPin() {
    if (this.pinStep === "confirm") {
      this.pinStep = "create";
      this.confirmPinDigits = ["", "", "", "", "", ""];
    } else {
      this.pinStep = null;
      this.pinDigits = ["", "", "", "", "", ""];
      this.selectedSecurityOption = null;
    }
  }
  trackByIndex(index) {
    return index;
  }
  static ɵfac = function SecurityPasswordComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SecurityPasswordComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_13__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](app_captcha_service__WEBPACK_IMPORTED_MODULE_14__.CaptchaService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](app_chrome_service__WEBPACK_IMPORTED_MODULE_15__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_13__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](app_tags_service__WEBPACK_IMPORTED_MODULE_10__.TagsService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](app_vault_service__WEBPACK_IMPORTED_MODULE_16__.VaultService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdefineComponent"]({
    type: SecurityPasswordComponent,
    selectors: [["security-password"]],
    decls: 9,
    vars: 0,
    consts: [["cross", ""], ["openEye", ""], ["closedEye", ""], ["toggleButton", ""], ["class", "zelf-card", 4, "transloco"], [1, "zelf-card"], [1, "zelf-card__header"], [1, "security-password__header-button"], ["mat-icon-button", "", 1, "zelf-icon-button", "zelf-icon-button--40", 3, "click"], ["viewBox", "0 0 22 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"], [4, "ngIf"], [1, "zelf-card__title"], [1, "zelf-card__subtitle"], [1, "security-password__selector"], [1, "security-password__selector-content"], [1, "security-password__selector-header"], [1, "security-password__selector-title"], [1, "security-password__selector-subtitle"], [1, "security-password__options"], [1, "security-password__option-wrapper", 3, "ngClass"], [1, "security-password__option-card", 3, "click", "ngClass"], [1, "security-password__option-content"], [1, "security-password__option-title"], [1, "security-password__option-description"], [1, "security-password__option-radio"], [1, "security-password__radio-button", 3, "ngClass"], [1, "security-password__radio-inner"], ["class", "security-password__checkmark", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], [1, "security-password__inline-form", 3, "ngClass"], [3, "ngSubmit", "formGroup"], [1, "security-password__form-content"], [1, "zelf-input", "zelf-input--wide", 3, "ngClass"], ["formControlName", "password", "id", "password", "name", "password", "placeholder", " ", "required", "", 1, "zelf-input__control", "zelf-input__control--floating-label", 3, "type"], ["for", "password", 1, "zelf-input__floating-label"], [4, "ngTemplateOutlet"], ["formControlName", "confirmPassword", "id", "confirmPassword", "name", "confirmPassword", "placeholder", " ", "required", "", 1, "zelf-input__control", "zelf-input__control--floating-label", 3, "type"], ["for", "confirmPassword", 1, "zelf-input__floating-label"], ["formControlName", "passwordStrength", 3, "password"], [1, "zelf-message", "zelf-message--error", "zelf-message--column"], [1, "security-password__pin-inline-subtitle"], [1, "security-password__pin-inputs-container"], ["class", "security-password__pin-inputs-row", 4, "ngIf"], [1, "zelf-card__actions", "security-password__selector-actions"], ["mat-flat-button", "", "color", "primary", 1, "zelf-button", "zelf-button--primary", "zelf-button--wide", 3, "click", "disabled"], ["viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "security-password__checkmark"], ["d", "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], [1, "zelf-message__row"], [1, "security-password__pin-inputs-row"], [1, "security-password__pin-inputs"], ["class", "security-password__pin-input", "maxlength", "1", "autocomplete", "off", 3, "type", "value", "input", "keydown", "focus", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["type", "button", 1, "security-password__pin-toggle", 3, "click"], ["viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], ["maxlength", "1", "autocomplete", "off", 1, "security-password__pin-input", 3, "input", "keydown", "focus", "type", "value"], ["viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"], ["d", "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"], ["class", "security-password__pin-confirm-input", "maxlength", "1", "autocomplete", "off", 3, "type", "value", "input", "keydown", "focus", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["maxlength", "1", "autocomplete", "off", 1, "security-password__pin-confirm-input", 3, "input", "keydown", "focus", "type", "value"], [1, "security-password__form", 3, "ngSubmit", "formGroup"], [1, "zelf-card__content"], ["class", "zelf-input zelf-input--wide", 3, "ngClass", 4, "ngIf"], [1, "zelf-card__actions", "security-password__actions"], ["mat-flat-button", "", "color", "primary", "type", "submit", 1, "zelf-button", "zelf-button--primary", "zelf-button--wide", 3, "disabled"], ["class", "security-password__pin-input", "type", "password", "maxlength", "1", "autocomplete", "off", 3, "value", "input", "keydown", "focus", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["type", "password", "maxlength", "1", "autocomplete", "off", 1, "security-password__pin-input", 3, "input", "keydown", "focus", "value"], ["width", "20", "height", "20", "viewBox", "0 0 20 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM14.3 14.3C13.91 14.69 13.28 14.69 12.89 14.3L10 11.41L7.11 14.3C6.72 14.69 6.09 14.69 5.7 14.3C5.31 13.91 5.31 13.28 5.7 12.89L8.59 10L5.7 7.11C5.31 6.72 5.31 6.09 5.7 5.7C6.09 5.31 6.72 5.31 7.11 5.7L10 8.59L12.89 5.7C13.28 5.31 13.91 5.31 14.3 5.7C14.69 6.09 14.69 6.72 14.3 7.11L11.41 10L14.3 12.89C14.68 13.27 14.68 13.91 14.3 14.3Z", "fill", "#DC362E"], ["fill", "none", "height", "24", "stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "stroke", "#181818", "viewBox", "0 0 24 24", "width", "24", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"], ["cx", "12", "cy", "12", "r", "3"], ["d", "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"], ["x1", "1", "y1", "1", "x2", "23", "y2", "23"], ["type", "button", "mat-icon-button", "", "tabindex", "-1", 1, "zelf-icon-button", "zelf-icon-button--transparent", "zelf-icon-button--no-fill", 3, "click"]],
    template: function SecurityPasswordComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](0, SecurityPasswordComponent_div_0_Template, 9, 3, "div", 4)(1, SecurityPasswordComponent_ng_template_1_Template, 2, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplateRefExtractor"])(3, SecurityPasswordComponent_ng_template_3_Template, 3, 0, "ng-template", null, 1, _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplateRefExtractor"])(5, SecurityPasswordComponent_ng_template_5_Template, 3, 0, "ng-template", null, 2, _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplateRefExtractor"])(7, SecurityPasswordComponent_ng_template_7_Template, 2, 1, "ng-template", null, 3, _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplateRefExtractor"]);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgTemplateOutlet, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormControlName, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_8__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_8__.TranslocoDirective, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_17__.MatIconButton, app_password_strength_password_strength_component__WEBPACK_IMPORTED_MODULE_9__.PasswordStrengthComponent],
    styles: ["[_ngcontent-%COMP%]:root {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc);\n}\n\n.zelf-button-external-link[_ngcontent-%COMP%] {\n  display: block;\n}\n.zelf-button-external-link--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.zelf-button[_ngcontent-%COMP%] {\n  align-items: center;\n  border-radius: 16px;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  gap: 8px;\n  height: 56px;\n  justify-content: center;\n  outline: none;\n  padding: 8px 24px;\n  text-align: center;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.zelf-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-button[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: inherit;\n}\n.zelf-button__text--margin-right[_ngcontent-%COMP%] {\n  margin-right: 1rem;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-button--thin[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  padding: 12px 16px;\n}\n.zelf-button--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.zelf-button--wide.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-button--primary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button, #181818) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--primary[_ngcontent-%COMP%]:active {\n  --mdc-filled-button-container-color: var(--zns-theme-text-muted, #96939e) !important;\n  background-color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-hover, #ff5721) !important;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff) !important;\n  stroke: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-text-secondary, #73777f) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-text-secondary, #73777f) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--secondary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-button-secondary-text, #495057) !important;\n  background-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  color: var(--zns-theme-button-secondary-text, #495057) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-secondary-text, #495057);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus, .zelf-button--secondary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-border, #e3e3e3) !important;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]:focus, .zelf-button--tertiary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%] {\n  --mdc-outlined-button-label-text-color: var(--zns-theme-button, #181818) !important;\n  --mdc-outlined-button-outline-color: var(--zns-theme-border, #e3e3e3) !important;\n  border: 1px solid var(--zns-theme-button, #181818) !important;\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-button, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button, #181818);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus, .zelf-button--outlined[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--outlined[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--outlined[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%] {\n  border: none !important;\n  background-color: transparent !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--red[_ngcontent-%COMP%]:focus, .zelf-button--red[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n}\n.zelf-button--red[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e);\n}\n.zelf-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n}\n\n.zelf-icon-button[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  align-items: center;\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  border-radius: 56px;\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  font-weight: 600;\n  gap: 16px;\n  height: 56px;\n  justify-content: center;\n  min-height: 56px;\n  min-width: 56px;\n  outline: none;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  -webkit-user-select: none;\n          user-select: none;\n  width: 56px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-icon-button.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: var(--zns-theme-text, #181818);\n  height: 24px;\n  width: 24px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%] {\n  height: 40px;\n  min-height: 40px;\n  min-width: 40px;\n  width: 40px;\n  border-radius: 40px;\n  padding: 0 8px;\n}\n.zelf-icon-button--40.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 14px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  height: 20px;\n  width: 20px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e) !important;\n  stroke: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:active {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus, .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%] {\n  background-color: transparent !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]:focus, .zelf-icon-button--transparent[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--text[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: initial !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  height: auto;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n  width: auto;\n}\n\n.zelf-icon-button-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:first-child {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:last-child {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.zelf-action-button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: 8px;\n}\n.zelf-action-button__icon[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  background: var(--zns-theme-card, #ffffff);\n  border-radius: 32px;\n  outline: 1px var(--zns-theme-border, #e3e3e3) solid;\n  outline-offset: -1px;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  cursor: pointer;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n@media (max-width: 600px) {\n  .zelf-action-button__icon[_ngcontent-%COMP%] {\n    padding: 8px 14px;\n  }\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-size: 24px;\n  line-height: 1;\n  font-variation-settings: \"FILL\" 0, \"wght\" 400, \"GRAD\" 0, \"opsz\" 24;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-primary, #181818);\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .zelf-action-button__text[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon-box[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  position: relative;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n}\n.zelf-action-button__text[_ngcontent-%COMP%] {\n  width: auto;\n  white-space: nowrap;\n  text-align: center;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 11px;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  line-height: 16px;\n  letter-spacing: 0.5px;\n  word-wrap: normal;\n}\n\n[_nghost-%COMP%] {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  justify-content: flex-start;\n}\n\n.security-password__header-button[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n  flex-direction: row;\n  width: 100%;\n}\n.security-password__form[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  margin-top: calc(12px * var(--zns-space-scale, 1));\n}\n.security-password__actions[_ngcontent-%COMP%], .security-password__content[_ngcontent-%COMP%] {\n  margin-top: calc(20px * var(--zns-space-scale, 1));\n}\n.security-password__actions[_ngcontent-%COMP%] {\n  flex-grow: 1;\n  align-items: flex-end;\n}\n.security-password__selector[_ngcontent-%COMP%] {\n  width: 100%;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: calc(24px * var(--zns-space-scale, 1));\n  height: 100%;\n  display: flex;\n}\n.security-password__selector-content[_ngcontent-%COMP%] {\n  width: 100%;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: calc(24px * var(--zns-space-scale, 1));\n  display: flex;\n}\n.security-password__selector-header[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0 calc(24px * var(--zns-space-scale, 1));\n  box-sizing: border-box;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  display: flex;\n}\n.security-password__selector-title[_ngcontent-%COMP%] {\n  width: 100%;\n  text-align: center;\n  color: var(--zns-theme-primary, #181818);\n  font-size: calc(20px * var(--zns-font-scale, 1));\n  font-family: \"Menda\", sans-serif;\n  font-weight: 700;\n  text-transform: uppercase;\n  line-height: calc(24px * var(--zns-font-scale, 1));\n  word-wrap: break-word;\n  margin: 0;\n}\n.security-password__selector-subtitle[_ngcontent-%COMP%] {\n  width: 100%;\n  text-align: center;\n  justify-content: center;\n  display: flex;\n  flex-direction: column;\n  color: var(--zns-theme-primary, #181818);\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  font-family: \"Poppins\", sans-serif;\n  font-weight: 500;\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  word-wrap: break-word;\n  margin: 0;\n}\n.security-password__options[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: calc(12px * var(--zns-space-scale, 1));\n}\n.security-password__option-card[_ngcontent-%COMP%] {\n  width: 90%;\n  height: calc(58px * var(--zns-space-scale, 1));\n  padding-left: calc(12px * var(--zns-space-scale, 1));\n  padding-right: calc(12px * var(--zns-space-scale, 1));\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  overflow: hidden;\n  border-radius: 16px;\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  justify-content: space-between;\n  align-items: center;\n  display: flex;\n  cursor: pointer;\n  transition: border-color 0.2s ease, background 0.2s ease;\n  outline: none;\n}\n.security-password__option-card--selected[_ngcontent-%COMP%] {\n  border: 2px solid var(--zns-theme-primary, #181818);\n}\n.security-password__option-content[_ngcontent-%COMP%] {\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: flex-start;\n  gap: calc(2px * var(--zns-space-scale, 1));\n  display: inline-flex;\n}\n.security-password__option-title[_ngcontent-%COMP%] {\n  justify-content: center;\n  display: flex;\n  flex-direction: column;\n  color: var(--zns-theme-text, #181818);\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  font-family: \"Poppins\", sans-serif;\n  font-weight: 600;\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  word-wrap: break-word;\n}\n.security-password__option-description[_ngcontent-%COMP%] {\n  justify-content: center;\n  display: flex;\n  flex-direction: column;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: calc(11px * var(--zns-font-scale, 1));\n  font-family: \"Poppins\", sans-serif;\n  font-weight: 500;\n  line-height: calc(16px * var(--zns-font-scale, 1));\n  letter-spacing: 0.5px;\n  word-wrap: break-word;\n}\n.security-password__option-radio[_ngcontent-%COMP%] {\n  padding: calc(8px * var(--zns-space-scale, 1));\n  background: var(--zns-theme-card-border, #eeedf1);\n  border-radius: calc(14px * var(--zns-space-scale, 1));\n  justify-content: center;\n  align-items: center;\n  gap: calc(10px * var(--zns-space-scale, 1));\n  display: flex;\n}\n.security-password__radio-button[_ngcontent-%COMP%] {\n  width: calc(24px * var(--zns-space-scale, 1));\n  height: calc(24px * var(--zns-space-scale, 1));\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.security-password__radio-button--selected[_ngcontent-%COMP%]   .security-password__radio-inner[_ngcontent-%COMP%] {\n  background: var(--zns-theme-primary, #181818);\n}\n.security-password__radio-inner[_ngcontent-%COMP%] {\n  width: calc(20px * var(--zns-space-scale, 1));\n  height: calc(20px * var(--zns-space-scale, 1));\n  position: absolute;\n  background: var(--zns-theme-border-hover, #c3c6cf);\n  border-radius: 50%;\n  transition: background 0.2s ease;\n}\n.security-password__checkmark[_ngcontent-%COMP%] {\n  width: calc(14px * var(--zns-space-scale, 1));\n  height: calc(14px * var(--zns-space-scale, 1));\n  position: relative;\n  z-index: 2;\n  display: block;\n  fill: var(--zns-theme-button-text, #ffffff);\n  stroke: var(--zns-theme-button-text, #ffffff);\n}\n.security-password__selector-actions[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-top: auto;\n}\n.security-password__option-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0;\n  max-height: calc(1000px * var(--zns-space-scale, 1));\n  opacity: 1;\n  overflow: hidden;\n  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.security-password__option-wrapper--hidden[_ngcontent-%COMP%] {\n  max-height: 0;\n  opacity: 0;\n  margin: 0;\n  pointer-events: none;\n}\n.security-password__inline-form[_ngcontent-%COMP%] {\n  width: 100%;\n  max-height: 0;\n  overflow: hidden;\n  opacity: 0;\n  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin-top 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  margin-top: 0;\n}\n.security-password__inline-form--visible[_ngcontent-%COMP%] {\n  max-height: calc(1000px * var(--zns-space-scale, 1));\n  opacity: 1;\n  margin-top: calc(12px * var(--zns-space-scale, 1));\n}\n.security-password__form-content[_ngcontent-%COMP%] {\n  width: 93%;\n  padding: calc(12px * var(--zns-space-scale, 1));\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  border-radius: 16px;\n  display: flex;\n  flex-direction: column;\n  gap: calc(12px * var(--zns-space-scale, 1));\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n}\n.security-password__pin-inline-subtitle[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--zns-theme-text, #181818);\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  font-family: \"Poppins\", sans-serif;\n  font-weight: 500;\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  text-align: center;\n}\n.security-password__pin-container[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  overflow: hidden;\n  border-radius: calc(48px * var(--zns-space-scale, 1));\n  flex-direction: column;\n  justify-content: space-between;\n  align-items: center;\n  display: flex;\n  padding: 0;\n}\n.security-password__pin-header[_ngcontent-%COMP%] {\n  width: 100%;\n  padding-top: calc(24px * var(--zns-space-scale, 1));\n  padding-left: calc(24px * var(--zns-space-scale, 1));\n  padding-right: calc(24px * var(--zns-space-scale, 1));\n  justify-content: space-between;\n  align-items: center;\n  display: flex;\n}\n.security-password__pin-back-button[_ngcontent-%COMP%] {\n  padding: calc(12px * var(--zns-space-scale, 1));\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  border-radius: calc(48px * var(--zns-space-scale, 1));\n  justify-content: center;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  display: flex;\n  border: none;\n  cursor: pointer;\n}\n.security-password__pin-back-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: calc(28px * var(--zns-space-scale, 1));\n  height: calc(28px * var(--zns-space-scale, 1));\n}\n.security-password__pin-content[_ngcontent-%COMP%] {\n  align-self: stretch;\n  flex: 1 1 0;\n  padding-left: calc(16px * var(--zns-space-scale, 1));\n  padding-right: calc(16px * var(--zns-space-scale, 1));\n  padding-top: calc(24px * var(--zns-space-scale, 1));\n  padding-bottom: calc(24px * var(--zns-space-scale, 1));\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: calc(24px * var(--zns-space-scale, 1));\n  display: flex;\n}\n.security-password__pin-header-text[_ngcontent-%COMP%] {\n  align-self: stretch;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  display: flex;\n}\n.security-password__pin-title[_ngcontent-%COMP%] {\n  align-self: stretch;\n  text-align: center;\n  color: var(--zns-theme-text, #181818);\n  font-size: calc(20px * var(--zns-font-scale, 1));\n  font-family: \"Menda\", sans-serif;\n  font-weight: 700;\n  text-transform: uppercase;\n  line-height: calc(24px * var(--zns-font-scale, 1));\n  word-wrap: break-word;\n  margin: 0;\n}\n.security-password__pin-subtitle[_ngcontent-%COMP%] {\n  align-self: stretch;\n  text-align: center;\n  justify-content: center;\n  display: flex;\n  flex-direction: column;\n  color: var(--zns-theme-text, #181818);\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  font-family: \"Poppins\", sans-serif;\n  font-weight: 500;\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  word-wrap: break-word;\n  margin: 0;\n}\n.security-password__pin-inputs-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: calc(12px * var(--zns-space-scale, 1));\n  width: 100%;\n  align-items: center;\n}\n.security-password__pin-inputs-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n}\n.security-password__pin-inputs[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n  align-items: flex-start;\n  gap: calc(6px * var(--zns-space-scale, 1));\n  display: inline-flex;\n}\n.security-password__pin-toggle[_ngcontent-%COMP%] {\n  background: transparent;\n  border: none;\n  cursor: pointer;\n  padding: calc(8px * var(--zns-space-scale, 1));\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  transition: background-color 0.2s;\n}\n.security-password__pin-toggle[_ngcontent-%COMP%]:hover {\n  background: rgba(0, 0, 0, 0.05);\n}\n.security-password__pin-toggle[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: calc(20px * var(--zns-space-scale, 1));\n  height: calc(20px * var(--zns-space-scale, 1));\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.security-password__pin-input[_ngcontent-%COMP%], .security-password__pin-confirm-input[_ngcontent-%COMP%] {\n  width: calc(40px * var(--zns-space-scale, 1));\n  height: calc(48px * var(--zns-space-scale, 1));\n  padding: calc(8px * var(--zns-space-scale, 1)) calc(4px * var(--zns-space-scale, 1));\n  background: var(--zns-theme-card, #ffffff);\n  overflow: hidden;\n  border-radius: 12px;\n  outline: 1px var(--zns-theme-text-secondary, #73777f) solid;\n  outline-offset: -0.5px;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n  border: none;\n  text-align: center;\n  color: var(--zns-theme-text, #181818);\n  font-size: calc(16px * var(--zns-font-scale, 1));\n  font-family: \"Poppins\", sans-serif;\n  font-weight: 600;\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  word-wrap: break-word;\n}\n.security-password__pin-input[_ngcontent-%COMP%]:focus, .security-password__pin-confirm-input[_ngcontent-%COMP%]:focus {\n  outline: 2px solid var(--zns-theme-primary, #181818);\n  outline-offset: -1px;\n}\n.security-password__pin-input[_ngcontent-%COMP%]::placeholder, .security-password__pin-confirm-input[_ngcontent-%COMP%]::placeholder {\n  color: transparent;\n}\n.security-password__pin-actions[_ngcontent-%COMP%] {\n  align-self: stretch;\n  padding-bottom: calc(24px * var(--zns-space-scale, 1));\n  padding-left: calc(24px * var(--zns-space-scale, 1));\n  padding-right: calc(24px * var(--zns-space-scale, 1));\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: calc(24px * var(--zns-space-scale, 1));\n  display: flex;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX2J1dHRvbnMuc2NzcyIsIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX3ZhcmlhYmxlcy5zY3NzIiwid2VicGFjazovLy4vc3JjL2FwcC9zZWN1cml0eS1wYXNzd29yZC9zZWN1cml0eS1wYXNzd29yZC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNJLGdFQzBCdUI7QUMzQjNCOztBRklBO0VBQ0ksY0FBQTtBRURKO0FGR0k7RUFDSSxXQUFBO0FFRFI7O0FGS0E7RUFDSSxtQkFBQTtFQUNBLG1CQUFBO0VBQ0EsWUFBQTtFQUNBLGVBQUE7RUFDQSxhQUFBO0VBQ0EsdUVDSWM7RURIZCxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxRQUFBO0VBQ0EsWUFBQTtFQUNBLHVCQUFBO0VBQ0EsYUFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSx5QkFBQTtVQUFBLGlCQUFBO0FFRko7QUZJSTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsUUFBQTtBRUZSO0FGS0k7RUFDSSxTQUFBO0VBQ0EsY0FBQTtBRUhSO0FGT1E7RUFDSSxrQkFBQTtBRUxaO0FGU0k7RUFDSSw2QkFBQTtFQUNBLCtDQ2xCYTtFRG1CYixlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQkFBQTtFQUNBLGlCQUFBO0VBQ0EsNkdBQ0k7QUVSWjtBRldRO0VBQ0ksZUFBQTtBRVRaO0FGWVE7RUFDSSw4Q0NoQ1M7QUNzQnJCO0FGYVE7RUFDSSxxQ0N0Q0E7RUR1Q0Esa0RDeEJFO0FDYWQ7QUZhWTtFQUNJLG9DQzFDSjtBQytCWjtBRmVRO0VBQ0ksbUJBQUE7RUFDQSxzREFBQTtBRWJaO0FGZVk7RUFDSSwwQ0NsREM7QUNxQ2pCO0FGa0JJO0VBQ0ksa0JBQUE7RUFDQSxrQkFBQTtBRWhCUjtBRm1CSTtFQUNJLFdBQUE7QUVqQlI7QUZtQlE7RUFDSSxtQkFBQTtBRWpCWjtBRnFCSTtFQUVJLGdGQUFBO0VBQ0EsK0VB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MVdJO0VDMldKLGdCQUFBO0VBQ0EsbUJBQUE7RUFDQSwyREFBQTtFQUNBLHNCQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQkFBQTtFQUNBLGFBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxxQ0R0WUk7RUN1WUosZ0RBQUE7RUFDQSxrQ0FBQTtFQUNBLGdCQUFBO0VBQ0Esa0RBQUE7RUFDQSxxQkFBQTtFQUNBLHFCQUFBO0FBb2NSO0FBbGNRO0VBQ0ksb0RBQUE7RUFDQSxvQkFBQTtBQW9jWjtBQWpjUTtFQUNJLGtCQUFBO0FBbWNaO0FBL2JJO0VBQ0ksbUJBQUE7RUFDQSxzREFBQTtFQUNBLG9EQUFBO0VBQ0EscURBQUE7RUFDQSxzQkFBQTtFQUNBLDJCQUFBO0VBQ0EsbUJBQUE7RUFDQSwyQ0FBQTtFQUNBLGFBQUE7QUFpY1IiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwiLi92YXJpYWJsZXNcIjtcblxuOnJvb3Qge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5O1xufVxuXG4uemVsZi1idXR0b24tZXh0ZXJuYWwtbGluayB7XG4gICAgZGlzcGxheTogYmxvY2s7XG5cbiAgICAmLS13aWRlIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxufVxuXG4uemVsZi1idXR0b24ge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIGdhcDogOHB4O1xuICAgIGhlaWdodDogNTZweDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBvdXRsaW5lOiBub25lO1xuICAgIHBhZGRpbmc6IDhweCAyNHB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcblxuICAgIHNwYW4ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgfVxuXG4gICAgcCB7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgY29sb3I6IGluaGVyaXQ7XG4gICAgfVxuXG4gICAgJl9fdGV4dCB7XG4gICAgICAgICYtLW1hcmdpbi1yaWdodCB7XG4gICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDFyZW07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1oeXBlcmxpbmsge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICAgICAgcGFkZGluZzogOHB4IDE2cHg7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICYtLXNtYWxsIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10aGluIHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICBwYWRkaW5nOiAxMnB4IDE2cHg7XG4gICAgfVxuXG4gICAgJi0td2lkZSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgICAgICYuemVsZi1idXR0b24tLWh5cGVybGluayB7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tcHJpbWFyeSB7XG4gICAgICAgIC8vIE1EQyBtYXQtZmxhdC1idXR0b24gcGFpbnRzIHZpYSBDU1MgdmFyaWFibGVzOyBhbGlnbiB3aXRoIFplbGYgdG9rZW5zIChhdm9pZHMgZGVmYXVsdCBNYXRlcmlhbCBibHVlKS5cbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvbn0gIWltcG9ydGFudDtcbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVDYXJkfSAhaW1wb3J0YW50O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6YWN0aXZlIHtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWR9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3Zlcn0gIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICB9XG5cbiAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnl9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWxhYmVsLXRleHQtY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUNhcmR9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zZWNvbmRhcnkge1xuICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5fSAhaW1wb3J0YW50O1xuICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWxhYmVsLXRleHQtY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeVRleHR9ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5SG92ZXJ9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWxhYmVsLXRleHQtY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUNhcmR9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5SG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQm9yZGVyfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlciAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXRlcnRpYXJ5IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1vdXRsaW5lZCB7XG4gICAgICAgIC0tbWRjLW91dGxpbmVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b259ICFpbXBvcnRhbnQ7XG4gICAgICAgIC0tbWRjLW91dGxpbmVkLWJ1dHRvbi1vdXRsaW5lLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCb3JkZXJ9ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUJ1dHRvbiAhaW1wb3J0YW50O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbiAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbjtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbkhvdmVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXJlZCB7XG4gICAgICAgIGJvcmRlcjogbm9uZSAhaW1wb3J0YW50O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kZXJyb3JMaWdodCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1lcnJvciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kZXJyb3JMaWdodCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGVycm9yICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zdWNjZXNzIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRjb3JyZWN0TGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXBpbGwge1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDA7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgcGFkZGluZzogNHB4IDEycHg7XG4gICAgfVxufVxuXG4uemVsZi1pY29uLWJ1dHRvbiB7XG4gICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXIgIWltcG9ydGFudDtcbiAgICBib3JkZXItcmFkaXVzOiA1NnB4O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICBnYXA6IDE2cHg7XG4gICAgaGVpZ2h0OiA1NnB4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG1pbi1oZWlnaHQ6IDU2cHg7XG4gICAgbWluLXdpZHRoOiA1NnB4O1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgdHJhbnNpdGlvbjpcbiAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgIHdpZHRoOiA1NnB4O1xuXG4gICAgc3BhbiB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICB9XG5cbiAgICAmLnplbGYtaWNvbi1idXR0b24tLWJvcmRlci1zb2Z0IHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICB9XG5cbiAgICBzdmcge1xuICAgICAgICB0cmFuc2l0aW9uOiBmaWxsIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBoZWlnaHQ6IDI0cHg7XG4gICAgICAgIHdpZHRoOiAyNHB4O1xuICAgIH1cblxuICAgICY6aG92ZXIge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHNlY29uZGFyeUNvbG9yICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1ib3JkZXItc29mdCB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgfVxuXG4gICAgJi0tNDAge1xuICAgICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDQwcHg7XG4gICAgICAgIG1pbi13aWR0aDogNDBweDtcbiAgICAgICAgd2lkdGg6IDQwcHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDQwcHg7XG4gICAgICAgIHBhZGRpbmc6IDAgOHB4O1xuXG4gICAgICAgICYuemVsZi1pY29uLWJ1dHRvbi0tYm9yZGVyLXNvZnQge1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTRweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBoZWlnaHQ6IDIwcHg7XG4gICAgICAgICAgICB3aWR0aDogMjBweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWh5cGVybGluayB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBwYWRkaW5nOiA4cHggMTZweDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuMnMgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJi0tc21hbGwge1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1wcmltYXJ5IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbiAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjphY3RpdmUge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbkhvdmVyICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbkhvdmVyICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zZWNvbmRhcnkge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlciAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHNlY29uZGFyeUNvbG9yICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlciAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXRyYW5zcGFyZW50IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXRleHQge1xuICAgICAgICB3aWR0aDogYXV0byAhaW1wb3J0YW50O1xuICAgICAgICBtaW4td2lkdGg6IGluaXRpYWwgIWltcG9ydGFudDtcbiAgICB9XG5cbiAgICAmLS1lcnJvciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kZXJyb3JMaWdodCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGVycm9yICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zdWNjZXNzIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRjb3JyZWN0TGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXBpbGwge1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIGhlaWdodDogYXV0bztcbiAgICAgICAgbWluLWhlaWdodDogMDtcbiAgICAgICAgbWluLXdpZHRoOiAwO1xuICAgICAgICBwYWRkaW5nOiA0cHggMTJweDtcbiAgICAgICAgd2lkdGg6IGF1dG87XG4gICAgfVxufVxuXG4uemVsZi1pY29uLWJ1dHRvbi1ncm91cCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogMDtcblxuICAgIC56ZWxmLWljb24tYnV0dG9uIHtcbiAgICAgICAgJjpmaXJzdC1jaGlsZCB7XG4gICAgICAgICAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMDtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpub3QoOmZpcnN0LWNoaWxkKTpub3QoOmxhc3QtY2hpbGQpIHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDA7XG4gICAgICAgIH1cblxuICAgICAgICAmOmxhc3QtY2hpbGQge1xuICAgICAgICAgICAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogMDtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDA7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi56ZWxmLWFjdGlvbi1idXR0b24ge1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiA4cHg7XG5cbiAgICAmX19pY29uIHtcbiAgICAgICAgcGFkZGluZzogMTBweCAyMHB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMzJweDtcbiAgICAgICAgb3V0bGluZTogMXB4IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgc29saWQ7XG4gICAgICAgIG91dGxpbmUtb2Zmc2V0OiAtMXB4O1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogOHB4O1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiB2YXJpYWJsZXMuJG1pblNtYWxsKSB7XG4gICAgICAgICAgICBwYWRkaW5nOiA4cHggMTRweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGZpbGwgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC5tYXRlcmlhbC1zeW1ib2xzLW91dGxpbmVkIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgICAgICAgICAgZm9udC12YXJpYXRpb24tc2V0dGluZ3M6XG4gICAgICAgICAgICAgICAgXCJGSUxMXCIgMCxcbiAgICAgICAgICAgICAgICBcIndnaHRcIiA0MDAsXG4gICAgICAgICAgICAgICAgXCJHUkFEXCIgMCxcbiAgICAgICAgICAgICAgICBcIm9wc3pcIiAyNDtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kcHJpbWFyeUNvbG9yO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAubWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAuemVsZi1hY3Rpb24tYnV0dG9uX190ZXh0IHtcbiAgICAgICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19pY29uLWJveCB7XG4gICAgICAgIHdpZHRoOiAyOHB4O1xuICAgICAgICBoZWlnaHQ6IDI4cHg7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIH1cblxuICAgICZfX3RleHQge1xuICAgICAgICB3aWR0aDogYXV0bztcbiAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBsaW5lLWhlaWdodDogMTZweDtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgICAgICB3b3JkLXdyYXA6IG5vcm1hbDtcbiAgICB9XG59XG4iLCIkcHJpbWFyeUNvbG9yOiB2YXIoLS16bnMtdGhlbWUtcHJpbWFyeSwgIzE4MTgxOCk7XG4kcHJpbWFyeUxpZ2h0OiAjZGFkZGZhO1xuJHNlY29uZGFyeUNvbG9yOiB2YXIoLS16bnMtdGhlbWUtc2Vjb25kYXJ5LCAjZmY1NzIxKTtcbiRzZWNvbmRhcnlDb2xvckxpZ2h0OiAjZjZlNWUwO1xuXG4kY29ycmVjdDogdmFyKC0tem5zLXRoZW1lLXN1Y2Nlc3MsICMxZWE0NDYpO1xuJGNvcnJlY3REYXJrOiAjMGY1MjIzO1xuJGNvcnJlY3RMaWdodDogdmFyKC0tem5zLXRoZW1lLXN1Y2Nlc3MtdGV4dCwgI2U3ZjhlZCk7XG5cbiRlcnJvcjogdmFyKC0tem5zLXRoZW1lLWVycm9yLCAjZGMzNjJlKTtcbiRlcnJvckRhcms6ICM2MDE0MTA7XG4kZXJyb3JMaWdodDogdmFyKC0tem5zLXRoZW1lLWVycm9yLXRleHQsICNmY2VlZWUpO1xuXG4kd2FybmluZzogdmFyKC0tem5zLXRoZW1lLXdhcm5pbmcsICNkZTY4MDApO1xuJHdhcm5pbmdEYXJrOiAjNGEyMTBhO1xuJHdhcm5pbmdMaWdodDogdmFyKC0tem5zLXRoZW1lLXdhcm5pbmctdGV4dCwgI2ZmZWVlOSk7XG5cbiRpbmZvOiAjMzk5OGQzO1xuJGluZm9EYXJrOiAjMDA0YTc3O1xuJGluZm9MaWdodDogI2VjZjNmZTtcblxuJGJsYWNrOiAjMTgxODE4O1xuJHdoaXRlOiAjZmZmZmZmO1xuXG4kdGhlbWVCb2R5RmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtYm9keS1mYW1pbHksIFwiUG9wcGluc1wiLCBBcmlhbCwgc2Fucy1zZXJpZik7XG4kdGhlbWVUaXRsZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLXRpdGxlLWZhbWlseSwgXCJNZW5kYVwiLCBcIkFyaWFsIEJsYWNrXCIsIHNhbnMtc2VyaWYpO1xuJHRoZW1lTW9ub3NwYWNlRmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtbW9ub3NwYWNlLWZhbWlseSwgXCJDb3VyaWVyIE5ld1wiLCBDb3VyaWVyLCBtb25vc3BhY2UpO1xuXG4kdGhlbWVCYWNrZ3JvdW5kOiB2YXIoLS16bnMtdGhlbWUtYmFja2dyb3VuZCwgI2ZmZmZmZik7XG4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtYmFja2dyb3VuZC1zZWNvbmRhcnksICNmOWY5ZmMpO1xuXG4kdGhlbWVUZXh0OiB2YXIoLS16bnMtdGhlbWUtdGV4dCwgIzE4MTgxOCk7XG4kdGhlbWVUZXh0TXV0ZWQ6IHZhcigtLXpucy10aGVtZS10ZXh0LW11dGVkLCAjOTY5MzllKTtcbiR0aGVtZVRleHRTZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS10ZXh0LXNlY29uZGFyeSwgIzczNzc3Zik7XG5cbiR0aGVtZUhlYWRlcjogdmFyKC0tem5zLXRoZW1lLWhlYWRlciwgIzE4MTgxOCk7XG4kdGhlbWVIZWFkZXJUZXh0OiB2YXIoLS16bnMtdGhlbWUtaGVhZGVyLXRleHQsICNmZmZmZmYpO1xuXG4kdGhlbWVCdXR0b246IHZhcigtLXpucy10aGVtZS1idXR0b24sICMxODE4MTgpO1xuJHRoZW1lQnV0dG9uVGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi10ZXh0LCAjZmZmZmZmKTtcbiR0aGVtZUJ1dHRvbkhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLWhvdmVyLCAjZmY1NzIxKTtcblxuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeSwgI2U5ZWNlZik7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeS10ZXh0LCAjNDk1MDU3KTtcbiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeS1ob3ZlciwgI2U5ZWNlZik7XG5cbiR0aGVtZUJvcmRlcjogdmFyKC0tem5zLXRoZW1lLWJvcmRlciwgI2UzZTNlMyk7XG4kdGhlbWVCb3JkZXJIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJvcmRlci1ob3ZlciwgI2MzYzZjZik7XG5cbiR0aGVtZUNhcmQ6IHZhcigtLXpucy10aGVtZS1jYXJkLCAjZmZmZmZmKTtcbiR0aGVtZUNhcmRCb3JkZXI6IHZhcigtLXpucy10aGVtZS1jYXJkLWJvcmRlciwgI2VlZWRmMSk7XG5cbiR0aGVtZVNoYWRvdzogdmFyKC0tem5zLXRoZW1lLXNoYWRvdywgcmdiYSgwLCAwLCAwLCAwLjEpKTtcblxuJHNtb290aEJlemllcjogY3ViaWMtYmV6aWVyKDAuMjUsIDAuNCwgMC43LCAxKTtcblxuJG1heEV4dHJhU21hbGw6IDU5NXB4O1xuJG1pblNtYWxsOiA2MDBweDtcbiRtZWRpdW06IDc2OHB4O1xuJGxhcmdlOiA4ODlweDtcbiRjb21wdXRlcnM6IDEyMDBweDtcbiIsIkB1c2UgXCIuLi8uLi9zdHlsZXMvdmFyaWFibGVzXCI7XG5AdXNlIFwiLi4vLi4vc3R5bGVzL2J1dHRvbnNcIjtcblxuOmhvc3Qge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGZsZXgtZ3JvdzogMTtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG59XG5cbi5zZWN1cml0eS1wYXNzd29yZCB7XG4gICAgJl9faGVhZGVyLWJ1dHRvbiB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgJl9fZm9ybSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBmbGV4LWdyb3c6IDE7XG4gICAgICAgIG1hcmdpbi10b3A6IGNhbGMoMTJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX2FjdGlvbnMsXG4gICAgJl9fY29udGVudCB7XG4gICAgICAgIG1hcmdpbi10b3A6IGNhbGMoMjBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX2FjdGlvbnMge1xuICAgICAgICBmbGV4LWdyb3c6IDE7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LWVuZDtcbiAgICB9XG5cbiAgICAmX19zZWxlY3RvciB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogY2FsYygyNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICB9XG5cbiAgICAmX19zZWxlY3Rvci1jb250ZW50IHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDI0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICB9XG5cbiAgICAmX19zZWxlY3Rvci1oZWFkZXIge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgcGFkZGluZzogMCBjYWxjKDI0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgfVxuXG4gICAgJl9fc2VsZWN0b3ItdGl0bGUge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRwcmltYXJ5Q29sb3I7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygyMHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgZm9udC1mYW1pbHk6IFwiTWVuZGFcIiwgc2Fucy1zZXJpZjtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMjRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIHdvcmQtd3JhcDogYnJlYWstd29yZDtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgIH1cblxuICAgICZfX3NlbGVjdG9yLXN1YnRpdGxlIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHByaW1hcnlDb2xvcjtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDE0cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LWZhbWlseTogXCJQb3BwaW5zXCIsIHNhbnMtc2VyaWY7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDIwcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xcHg7XG4gICAgICAgIHdvcmQtd3JhcDogYnJlYWstd29yZDtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgIH1cblxuICAgICZfX29wdGlvbnMge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19vcHRpb24tY2FyZCB7XG4gICAgICAgIHdpZHRoOiA5MCU7XG4gICAgICAgIGhlaWdodDogY2FsYyg1OHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHBhZGRpbmctbGVmdDogY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHBhZGRpbmctcmlnaHQ6IGNhbGMoMTJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAwLjJzIGVhc2UsIGJhY2tncm91bmQgMC4ycyBlYXNlO1xuICAgICAgICBvdXRsaW5lOiBub25lO1xuXG4gICAgICAgICYtLXNlbGVjdGVkIHtcbiAgICAgICAgICAgIGJvcmRlcjogMnB4IHNvbGlkIHZhcmlhYmxlcy4kcHJpbWFyeUNvbG9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fb3B0aW9uLWNvbnRlbnQge1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgICAgICBnYXA6IGNhbGMoMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIH1cblxuICAgICZfX29wdGlvbi10aXRsZSB7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgZm9udC1mYW1pbHk6IFwiUG9wcGluc1wiLCBzYW5zLXNlcmlmO1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygyMHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMXB4O1xuICAgICAgICB3b3JkLXdyYXA6IGJyZWFrLXdvcmQ7XG4gICAgfVxuXG4gICAgJl9fb3B0aW9uLWRlc2NyaXB0aW9uIHtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDExcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LWZhbWlseTogXCJQb3BwaW5zXCIsIHNhbnMtc2VyaWY7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDE2cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC41cHg7XG4gICAgICAgIHdvcmQtd3JhcDogYnJlYWstd29yZDtcbiAgICB9XG5cbiAgICAmX19vcHRpb24tcmFkaW8ge1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogY2FsYygxNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IGNhbGMoMTBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgIH1cblxuICAgICZfX3JhZGlvLWJ1dHRvbiB7XG4gICAgICAgIHdpZHRoOiBjYWxjKDI0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgaGVpZ2h0OiBjYWxjKDI0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblxuICAgICAgICAmLS1zZWxlY3RlZCB7XG4gICAgICAgICAgICAuc2VjdXJpdHktcGFzc3dvcmRfX3JhZGlvLWlubmVyIHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHByaW1hcnlDb2xvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3JhZGlvLWlubmVyIHtcbiAgICAgICAgd2lkdGg6IGNhbGMoMjBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBoZWlnaHQ6IGNhbGMoMjBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgICAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kIDAuMnMgZWFzZTtcbiAgICB9XG5cbiAgICAmX19jaGVja21hcmsge1xuICAgICAgICB3aWR0aDogY2FsYygxNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGhlaWdodDogY2FsYygxNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgei1pbmRleDogMjtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0O1xuICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0O1xuICAgIH1cblxuICAgICZfX3NlbGVjdG9yLWFjdGlvbnMge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIG1hcmdpbi10b3A6IGF1dG87XG4gICAgfVxuXG4gICAgJl9fb3B0aW9uLXdyYXBwZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBnYXA6IDA7XG4gICAgICAgIG1heC1oZWlnaHQ6IGNhbGMoMTAwMHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBtYXgtaGVpZ2h0IDAuNHMgY3ViaWMtYmV6aWVyKDAuNCwgMCwgMC4yLCAxKSxcbiAgICAgICAgICAgIG9wYWNpdHkgMC4zcyBjdWJpYy1iZXppZXIoMC40LCAwLCAwLjIsIDEpLFxuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbSAwLjNzIGN1YmljLWJlemllcigwLjQsIDAsIDAuMiwgMSk7XG5cbiAgICAgICAgJi0taGlkZGVuIHtcbiAgICAgICAgICAgIG1heC1oZWlnaHQ6IDA7XG4gICAgICAgICAgICBvcGFjaXR5OiAwO1xuICAgICAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19pbmxpbmUtZm9ybSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBtYXgtaGVpZ2h0OiAwO1xuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICBvcGFjaXR5OiAwO1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgbWF4LWhlaWdodCAwLjRzIGN1YmljLWJlemllcigwLjQsIDAsIDAuMiwgMSksXG4gICAgICAgICAgICBvcGFjaXR5IDAuM3MgY3ViaWMtYmV6aWVyKDAuNCwgMCwgMC4yLCAxKSxcbiAgICAgICAgICAgIG1hcmdpbi10b3AgMC4zcyBjdWJpYy1iZXppZXIoMC40LCAwLCAwLjIsIDEpO1xuICAgICAgICBtYXJnaW4tdG9wOiAwO1xuXG4gICAgICAgICYtLXZpc2libGUge1xuICAgICAgICAgICAgbWF4LWhlaWdodDogY2FsYygxMDAwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICAgICAgICBtYXJnaW4tdG9wOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2Zvcm0tY29udGVudCB7XG4gICAgICAgIHdpZHRoOiA5MyU7XG4gICAgICAgIHBhZGRpbmc6IGNhbGMoMTJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcbiAgICB9XG5cbiAgICAmX19waW4taW5saW5lLXN1YnRpdGxlIHtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgZm9udC1mYW1pbHk6IFwiUG9wcGluc1wiLCBzYW5zLXNlcmlmO1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygyMHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMXB4O1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgJl9fcGluLWNvbnRhaW5lciB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5O1xuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICBib3JkZXItcmFkaXVzOiBjYWxjKDQ4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBwYWRkaW5nOiAwO1xuICAgIH1cblxuICAgICZfX3Bpbi1oZWFkZXIge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgcGFkZGluZy10b3A6IGNhbGMoMjRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBwYWRkaW5nLWxlZnQ6IGNhbGMoMjRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBwYWRkaW5nLXJpZ2h0OiBjYWxjKDI0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgIH1cblxuICAgICZfX3Bpbi1iYWNrLWJ1dHRvbiB7XG4gICAgICAgIHBhZGRpbmc6IGNhbGMoMTJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogY2FsYyg0OHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICB3aWR0aDogY2FsYygyOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgICAgICBoZWlnaHQ6IGNhbGMoMjhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fcGluLWNvbnRlbnQge1xuICAgICAgICBhbGlnbi1zZWxmOiBzdHJldGNoO1xuICAgICAgICBmbGV4OiAxIDEgMDtcbiAgICAgICAgcGFkZGluZy1sZWZ0OiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgcGFkZGluZy1yaWdodDogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHBhZGRpbmctdG9wOiBjYWxjKDI0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgcGFkZGluZy1ib3R0b206IGNhbGMoMjRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogY2FsYygyNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgfVxuXG4gICAgJl9fcGluLWhlYWRlci10ZXh0IHtcbiAgICAgICAgYWxpZ24tc2VsZjogc3RyZXRjaDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgfVxuXG4gICAgJl9fcGluLXRpdGxlIHtcbiAgICAgICAgYWxpZ24tc2VsZjogc3RyZXRjaDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygyMHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgZm9udC1mYW1pbHk6IFwiTWVuZGFcIiwgc2Fucy1zZXJpZjtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMjRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIHdvcmQtd3JhcDogYnJlYWstd29yZDtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgIH1cblxuICAgICZfX3Bpbi1zdWJ0aXRsZSB7XG4gICAgICAgIGFsaWduLXNlbGY6IHN0cmV0Y2g7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDE0cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LWZhbWlseTogXCJQb3BwaW5zXCIsIHNhbnMtc2VyaWY7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDIwcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xcHg7XG4gICAgICAgIHdvcmQtd3JhcDogYnJlYWstd29yZDtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgIH1cblxuICAgICZfX3Bpbi1pbnB1dHMtY29udGFpbmVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgJl9fcGluLWlucHV0cy1yb3cge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgfVxuXG4gICAgJl9fcGluLWlucHV0cyB7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gICAgICAgIGdhcDogY2FsYyg2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgfVxuXG4gICAgJl9fcGluLXRvZ2dsZSB7XG4gICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgcGFkZGluZzogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzO1xuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjA1KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICB3aWR0aDogY2FsYygyMHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgICAgICBoZWlnaHQ6IGNhbGMoMjBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19waW4taW5wdXQsXG4gICAgJl9fcGluLWNvbmZpcm0taW5wdXQge1xuICAgICAgICB3aWR0aDogY2FsYyg0MHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGhlaWdodDogY2FsYyg0OHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHBhZGRpbmc6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSkgY2FsYyg0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICAgIG91dGxpbmU6IDFweCB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSBzb2xpZDtcbiAgICAgICAgb3V0bGluZS1vZmZzZXQ6IC0wLjVweDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgZm9udC1mYW1pbHk6IFwiUG9wcGluc1wiLCBzYW5zLXNlcmlmO1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygyMHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMXB4O1xuICAgICAgICB3b3JkLXdyYXA6IGJyZWFrLXdvcmQ7XG5cbiAgICAgICAgJjpmb2N1cyB7XG4gICAgICAgICAgICBvdXRsaW5lOiAycHggc29saWQgdmFyaWFibGVzLiRwcmltYXJ5Q29sb3I7XG4gICAgICAgICAgICBvdXRsaW5lLW9mZnNldDogLTFweDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6OnBsYWNlaG9sZGVyIHtcbiAgICAgICAgICAgIGNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3Bpbi1hY3Rpb25zIHtcbiAgICAgICAgYWxpZ24tc2VsZjogc3RyZXRjaDtcbiAgICAgICAgcGFkZGluZy1ib3R0b206IGNhbGMoMjRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBwYWRkaW5nLWxlZnQ6IGNhbGMoMjRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBwYWRkaW5nLXJpZ2h0OiBjYWxjKDI0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IGNhbGMoMjRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ },

/***/ 63617
/*!*****************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/observable/merge.js ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   merge: () => (/* binding */ merge)
/* harmony export */ });
/* harmony import */ var _operators_mergeAll__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../operators/mergeAll */ 23222);
/* harmony import */ var _innerFrom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./innerFrom */ 82645);
/* harmony import */ var _empty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./empty */ 59400);
/* harmony import */ var _util_args__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/args */ 4083);
/* harmony import */ var _from__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./from */ 95429);





function merge(...args) {
  const scheduler = (0,_util_args__WEBPACK_IMPORTED_MODULE_3__.popScheduler)(args);
  const concurrent = (0,_util_args__WEBPACK_IMPORTED_MODULE_3__.popNumber)(args, Infinity);
  const sources = args;
  return !sources.length ? _empty__WEBPACK_IMPORTED_MODULE_2__.EMPTY : sources.length === 1 ? (0,_innerFrom__WEBPACK_IMPORTED_MODULE_1__.innerFrom)(sources[0]) : (0,_operators_mergeAll__WEBPACK_IMPORTED_MODULE_0__.mergeAll)(concurrent)((0,_from__WEBPACK_IMPORTED_MODULE_4__.from)(sources, scheduler));
}

/***/ }

}]);
//# sourceMappingURL=src_app_security-password_security-password_component_ts.js.map