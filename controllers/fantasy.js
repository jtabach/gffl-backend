const mongoose = require('mongoose');

const helper = require('../helpers');

const FantasyController = {
  getStandings
};

let CACHE = {};
let CACHE_TIME = 60000 * 60;

async function getStandings(req, res, next) {
  const { fantasyLeagueId } = req.params;

  if (CACHE.standings && (Date.now() - CACHE.standings.lastUpdated) < CACHE_TIME) {
    return res.status(200).send({ standings: CACHE.standings.content });;
  }

  const data = await helper.asyncRequest({
      url: `http://games.espn.com/ffl/api/v2/standings?leagueId=${fantasyLeagueId}&seasonId=2018`,
      method: "GET"
  }).then(response => JSON.parse(response));

  const standingsData = {
    content: structureStandingsData(data.teams),
    lastUpdated: Date.now()
  };

  CACHE.standings = standingsData;

  return res.status(200).send({ standings: CACHE.standings.content });
}

function structureStandingsData(teams) {
  const divisions = {};

  teams.forEach(({ teamLocation, teamNickname, owners, record, division }) => {
    if (!divisions[division.divisionId]) {
      divisions[division.divisionId] = [];
    }
    divisions[division.divisionId].push({ teamLocation, teamNickname, owners, record, division });
  });

  return divisions;
}

module.exports = FantasyController;
