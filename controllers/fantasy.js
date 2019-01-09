const _ = require('lodash');
const mongoose = require('mongoose');

const helper = require('../helpers');

const Team = require('../models/Team');

const FantasyController = {
  getStandings,
  getScores,
  getRoster
};

const CACHE = {};
const CACHE_TIME = 60000 * 60;
const ESPN_BASE_URL = 'http://games.espn.com/ffl/api/v2';

const rosterSlotPositionDict = {
  0: 'QB',
  2: 'RB',
  4: 'WR',
  6: 'TE',
  23: 'FLEX',
  16: 'D/ST',
  17: 'K',
  20: 'BENCH',
  21: 'IR'
};

const rosterDefaultPositionDict = {
  1: 'QB',
  2: 'RB',
  3: 'WR',
  4: 'TE',
  5: 'K',
  16: 'D/ST'
}

const rosterSlotStarters = [0, 2, 4, 6, 23, 16, 17];

async function getStandings(req, res, next) {
  const { fantasyLeagueId } = req.params;

  if (!CACHE[fantasyLeagueId]) {
    CACHE[fantasyLeagueId] = {}
  }

  if (CACHE[fantasyLeagueId].standings && (Date.now() - CACHE[fantasyLeagueId].standings.lastUpdated) < CACHE_TIME) {
    return res.status(200).send({ standings: CACHE[fantasyLeagueId].standings.content });;
  }

  const data = await helper.asyncRequest({
      url: `${ESPN_BASE_URL}/standings?leagueId=${fantasyLeagueId}&seasonId=2018`,
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
    url: `${ESPN_BASE_URL}/scoreboard?leagueId=${fantasyLeagueId}&matchupPeriodId=${matchupPeriodId}&seasonId=2018`,
    method: "GET"
  }).then(response => JSON.parse(response));

  return res.status(200).send({ scores: data.scoreboard.matchups });
}

async function getRoster(req, res, next) {
  const { fantasyLeagueId, fantasyTeamId } = req.params;

  const foundTeam = await Team.findById(teamId);

  const data = await helper.asyncRequest({
    url: `${ESPN_BASE_URL}/rosterInfo?leagueId=${fantasyLeagueId}&seasonId=2018&teamId=${fantasyTeamId}`,
    method: "GET",
    headers: {
     'Cookie': helper.getESPNAuthCookieString()
    }
  }).then(response => JSON.parse(response));

  const roster = _structureRosterData(data.leagueRosters.teams[0]);

  return res.status(200).send({ roster: roster });
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

function _structureRosterData(roster) {
  const structuredRoster = {
    slots: roster.slots.map(slot => {
      if (!slot.player) {
        return {
          slotCategoryId: slot.slotCategoryId,
          slotPosition: rosterSlotPositionDict[slot.slotCategoryId],
          isFilled: false
        }
      }
      return {
        slotCategoryId: slot.slotCategoryId,
        slotPosition: rosterSlotPositionDict[slot.slotCategoryId],
        defaultPositionId: slot.player.defaultPositionId,
        defaultPosition: rosterDefaultPositionDict[slot.player.defaultPositionId],
        player: {
          firstName: slot.player.firstName,
          lastName: slot.player.lastName
        },
        isFilled: true
      }
    }),
    info: {
      teamLocation: roster.team.teamLocation,
      teamNickname: roster.team.teamNickname,
      divisionName: roster.team.division.divisionName,
      divisionStanding: roster.team.divisionStanding,
      overallStanding: roster.team.overallStanding
    }
  };

  const partitionedRoster = {
    slots: _.partition(structuredRoster.slots, slot => {
      return _.includes(rosterSlotStarters, slot.slotCategoryId)
    }),
    info: structuredRoster.info
  };

  return partitionedRoster;
}

function _sortByDivisionRank(teams) {
  return _.sortBy(teams, (team) => {
    return team.record.divisionStanding;
  });
}

module.exports = FantasyController;
