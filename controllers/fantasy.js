const _ = require('lodash');
const mongoose = require('mongoose');

const helper = require('../helpers');

const FantasyController = {
  getStandings,
  getScores
};

const CACHE = {};
const CACHE_TIME = 60000 * 60;
const ESPNBaseUrl = 'http://games.espn.com/ffl/api/v2';

async function getStandings(req, res, next) {
  const { fantasyLeagueId } = req.params;

  if (CACHE.standings && (Date.now() - CACHE.standings.lastUpdated) < CACHE_TIME) {
    return res.status(200).send({ standings: CACHE.standings.content });;
  }

  const data = await helper.asyncRequest({
      url: `${ESPNBaseUrl}/standings?leagueId=${fantasyLeagueId}&seasonId=2018`,
      method: "GET"
  }).then(response => JSON.parse(response));

  const standingsData = {
    content: _structureStandingsData(data.teams),
    lastUpdated: Date.now()
  };

  CACHE.standings = standingsData;

  return res.status(200).send({ standings: CACHE.standings.content });
}

async function getScores(req, res, next) {
  const { fantasyLeagueId, matchupPeriodId } = req.params;

  const data = await helper.asyncRequest({
    url: `${ESPNBaseUrl}/scoreboard?leagueId=${fantasyLeagueId}&matchupPeriodId=${matchupPeriodId}&seasonId=2018`,
    method: "GET"
  }).then(response => JSON.parse(response));

  return res.status(200).send({ scores: data.scoreboard.matchups });
}

function _structureStandingsData(teams) {
  const divisions = {};

  teams.forEach(({ teamLocation, teamNickname, owners, record, division }) => {
    if (!divisions[division.divisionId]) {
      divisions[division.divisionId] = [];
    }
    divisions[division.divisionId].push({ teamLocation, teamNickname, owners, record, division });
  });

  const sortedDivision = _.mapValues(divisions, (teams) => {
    return _sortByDivisionRank(teams);
  });

  return sortedDivision;
}

function _sortByDivisionRank(teams) {
  return _.sortBy(teams, (team) => {
    return team.record.divisionStanding;
  });
}

module.exports = FantasyController;
