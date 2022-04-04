'use strict';

/* local Dev or Test srv URL */
// const apiUrl = new URL('https://lt.ristissaar.ee/api/v1/match');
let getGurrentUrlHost = window.location.hostname;
let getGurrentUrlPort = window.location.port;
let getGurrentUrlProtocol = window.location.protocol;
let getGurrentUrlPath = window.location.pathname;
const getGurrentUrlPathLastItem = getGurrentUrlPath.substring(
  getGurrentUrlPath.lastIndexOf('/') + 1
);

let apiBaseUrl = `${getGurrentUrlProtocol}//lt-test.ristissaar.ee`;
const apiUrlPathForRegistration = '/api/v1/registration/';
const apiUrlPathForMatch = '/api/v1/match/';
const apiUrlPathForComp = '/api/v1/competition/';

if (getGurrentUrlHost == 'localhost') {
  apiBaseUrl = `${getGurrentUrlProtocol}//${getGurrentUrlHost}:${getGurrentUrlPort}`;
}

let apiUrlForRegistration = `${apiBaseUrl}${apiUrlPathForRegistration}${getGurrentUrlPathLastItem}`;
let apiUrlForMatch = `${apiBaseUrl}${apiUrlPathForMatch}${getGurrentUrlPathLastItem}`;
let apiUrlForComp = `${apiBaseUrl}${apiUrlPathForComp}${getGurrentUrlPathLastItem}`;

/* Second Navigation URL paths */
let secondNavLinkPath = '/voistlus/';
let secondNavLinkPathInfo = 'info/';
let secondNavLinkPathPlacement = 'paigutus/';
let secondNavLinkPathTable = 'tabel/';
let secondNavLinkPathMatches = 'mangud/';
let secondNavLinkPathResults = 'tulemused/';
let secondNavLinkPathAwards = 'auhinnad/';
document.getElementById(
  'linkInfo'
).href = `${secondNavLinkPath}${secondNavLinkPathInfo}${getGurrentUrlPathLastItem}`;
document.getElementById(
  'linkPaigutus'
).href = `${secondNavLinkPath}${secondNavLinkPathPlacement}${getGurrentUrlPathLastItem}`;
document.getElementById(
  'linkTabel'
).href = `${secondNavLinkPath}${secondNavLinkPathTable}${getGurrentUrlPathLastItem}`;
document.getElementById(
  'linkMangud'
).href = `${secondNavLinkPath}${secondNavLinkPathMatches}${getGurrentUrlPathLastItem}`;
document.getElementById(
  'linkTulemused'
).href = `${secondNavLinkPath}${secondNavLinkPathResults}${getGurrentUrlPathLastItem}`;
document.getElementById(
  'linkAuhinnad'
).href = `${secondNavLinkPath}${secondNavLinkPathAwards}${getGurrentUrlPathLastItem}`;

console.log('----- -----');
console.log('Võistluse Nimi: ' + localStorage.getItem('compName'));
console.log('Võistluse ID: ' + localStorage.getItem('compId'));
console.log('Võistluse ID from URL: ' + getGurrentUrlPathLastItem);
console.log('Reg API URL: ' + apiUrlForRegistration);
console.log('Match API URL: ' + apiUrlForMatch);
console.log('----- -----');

/* GET data from API-s */
function getData() {
  // eslint-disable-next-line no-undef
  axios
    // eslint-disable-next-line no-undef
    .all([
      axios.get(apiUrlForRegistration),
      axios.get(apiUrlForMatch),
      axios.get(apiUrlForComp),
    ])
    .then(response => {
      /* ELTL Reiting API Data*/
      const registrationData = response[0].data;
      console.table(registrationData);

      /* Match API Data*/
      const matchData = response[1].data;
      console.table(matchData);

      /* Match API Data*/
      const compData = response[2].data;
      console.table(compData);
      /* get  competitionName element from html and display compName from LocalStorage*/
      const competitionName = document.getElementById('competitionName');
      competitionName.innerText = compData.comp_name;

      insertTable(registrationData, matchData);
    })
    .catch(error => console.log(error));
}
getData();

function insertTable(registrationData, matchData) {
  const resultsTableBody = document.getElementById('resultsTable');
  // 1, 2, 3 place and so on ...
  const placementArray = [30, 37, 36, 35, 34, 33, 32, 31];

  for (const [i, value] of placementArray.entries()) {
    resultsTableBody.innerHTML += `
    <tr>
      <td class="text-center fw-bolder"></td>
      <td>${
        findPlayer(matchData[value].winner, registrationData).first_name
      }</td>
      <td>${findPlayer(matchData[value].winner, registrationData).fam_name}</td>
      <td class="text-center">${matchData[value].winner}</td>
      <td class="text-center">${parseDate(
        findPlayer(matchData[value].winner, registrationData).birthdate
      )}</td>
      <td class="text-center">${
        findPlayer(matchData[value].winner, registrationData).sex
      }</td>
    </tr>
    <tr>
      <td class="text-center fw-bolder"></td>
      <td>${
        findPlayer(matchData[value].loser, registrationData).first_name
      }</td>
      <td>${findPlayer(matchData[value].loser, registrationData).fam_name}</td>
      <td class="text-center">${matchData[value].loser}</td>
      <td class="text-center">${parseDate(
        findPlayer(matchData[value].loser, registrationData).birthdate
      )}</td>
      <td class="text-center">${
        findPlayer(matchData[value].loser, registrationData).sex
      }</td>
    </tr>
  `;
  }

  const placement = document.querySelectorAll('.fw-bolder');

  for (let i = 0; i < placement.length; i++) {
    const element = placement[i];
    element.innerText = i + 1;
  }
}

function findPlayer(id, data) {
  if (id === null) {
    return null;
  }

  const player = data.find(object => {
    return object.person_id === id;
  });
  const playerData = {
    ...player,
    fullName: player.first_name + ' ' + player.fam_name,
  };
  return playerData;
}

function parseDate(dateString) {
  /* axios uses JSON.stringify for serialisation and it causes 
  the translation to UTC. This loses 2 hours for timezone difference.
  Adding 2 hours to correct this */
  // dateString = moment(dateString).add(2, 'hours').format();

  let dateComponents = dateString.split('T');
  let datePieces = dateComponents[0].split('-');
  let year = datePieces[0];
  let month = datePieces[1];
  let day = datePieces[2];

  let competitionDate = `${day}.${month}.${year}`;

  return competitionDate;
}
