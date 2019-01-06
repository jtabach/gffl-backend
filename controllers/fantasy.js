const _ = require('lodash');
const mongoose = require('mongoose');

const helper = require('../helpers');

const FantasyController = {
  getStandings,
  getScores,
  getRoster
};

const CACHE = {};
const CACHE_TIME = 60000 * 60;
const ESPNBaseUrl = 'http://games.espn.com/ffl/api/v2';

async function getStandings(req, res, next) {
  const { fantasyLeagueId } = req.params;

  if (!CACHE[fantasyLeagueId]) {
    CACHE[fantasyLeagueId] = {}
  }

  if (CACHE[fantasyLeagueId].standings && (Date.now() - CACHE[fantasyLeagueId].standings.lastUpdated) < CACHE_TIME) {
    return res.status(200).send({ standings: CACHE[fantasyLeagueId].standings.content });;
  }

  const data = await helper.asyncRequest({
      url: `${ESPNBaseUrl}/standings?leagueId=${fantasyLeagueId}&seasonId=2018`,
      method: "GET"
  }).then(response => JSON.parse(response));

  const standingsData = {
    content: _structureStandingsData(data.teams),
    lastUpdated: Date.now()
  };

  console.log(standingsData);

  CACHE[fantasyLeagueId].standings = standingsData;

  return res.status(200).send({ standings: CACHE[fantasyLeagueId].standings.content });
}

async function getScores(req, res, next) {
  const { fantasyLeagueId, matchupPeriodId } = req.params;

  const data = await helper.asyncRequest({
    url: `${ESPNBaseUrl}/scoreboard?leagueId=${fantasyLeagueId}&matchupPeriodId=${matchupPeriodId}&seasonId=2018`,
    method: "GET"
  }).then(response => JSON.parse(response));

  return res.status(200).send({ scores: data.scoreboard.matchups });
}

async function getRoster(req, res, next) {
  const { fantasyLeagueId, fantasyTeamId } = req.params;

  const data = await helper.asyncRequest({
    url: `${ESPNBaseUrl}/rosterInfo?leagueId=${fantasyLeagueId}&seasonId=2018&teamId=${fantasyTeamId}`,
    method: "GET",
    headers: {
     'Cookie': helper.getESPNAuthCookieString()
    }
  }).then(response => JSON.parse(response));

  return res.status(200).send({ roster: data.leagueRosters.teams });
}

function _structureStandingsData(teams) {
  if (!teams) {
    return null;
  }
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
