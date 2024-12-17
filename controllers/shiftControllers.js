require("dotenv").config();
const msLoginConfig = require("../modules/msLoginConfig");
const axios = require("axios");
const { msUUID } = require("../modules/credentials");

const getTimeOffs = async (req, res) => {
  console.log("grabbing timeoffs...");

  const teamId = req.params.id;

  const login = await axios(msLoginConfig);
  const token = login.data.access_token;
  const date = new Date();
  const today = date.toISOString();

  const toConfig = {
    method: "get",
    url: `https://graph.microsoft.com/v1.0/teams/${teamId}/schedule/timesOff?$filter=sharedTimeOff/startDateTime ge ${today}`,
    headers: {
      "MS-APP-ACTS-AS": msUUID,
      Authorization: `Bearer ${token}`,
    },
  };

  const reasonConfig = (rId) => ({
    method: "get",
    url: `https://graph.microsoft.com/v1.0/teams/${teamId}/schedule/timeOffReasons/${rId}`,
    headers: {
      "MS-APP-ACTS-AS": msUUID,
      Authorization: `Bearer ${token}`,
    },
  });

  const nameConfig = (userId) => ({
    method: "get",
    url: `https://graph.microsoft.com/v1.0/users/${userId}`,
    headers: {
      "MS-APP-ACTS-AS": msUUID,
      Authorization: `Bearer ${token}`,
    },
  });

  try {
    const result = await axios(toConfig);

    const timeOffData = result.data.value;
    console.log(timeOffData);

    // should start and end be new Date?

    const timeOffs = timeOffData.map((t) => ({
      shiftId: t.id,
      userId: t.userId,
      userName: "",
      approvedBy: t.lastModifiedBy.user.displayName,
      start: new Date(t.sharedTimeOff.startDateTime),
      end: new Date(t.sharedTimeOff.endDateTime),
      duration:
        (new Date(t.sharedTimeOff.endDateTime) -
          new Date(t.sharedTimeOff.startDateTime)) /
        86400000,
      timeOffReasonId: t.sharedTimeOff.timeOffReasonId,
      timeOffReason: "",
    }));

    console.log(timeOffs);

    const toData = async () => {
      const promises = timeOffs.map(async (item) => {
        // Fetch reason and name concurrently for each item
        const [reasonResult, nameResult] = await Promise.all([
          axios(reasonConfig(item.timeOffReasonId)).catch(() => ({
            data: { displayName: "Unlisted" },
          })),
          axios(nameConfig(item.userId)).catch(() => ({
            data: { displayName: "Unlisted" },
          })),
        ]);

        // Assign fetched or default values
        item.timeOffReason = reasonResult.data.displayName;
        item.userName = nameResult.data.displayName;

        // Filter and return items where userName is not "Unlisted"
        return item.userName !== "Unlisted" ? item : null;
      });

      // Resolve all promises and filter out nulls
      const results = await Promise.all(promises);
      return results.filter((item) => item !== null);
    };

    const toDataFinal = await toData();
    console.log(toDataFinal);
    res.status(200).send(toDataFinal);
  } catch (error) {
    console.log("error getting time offs", error);
    res.status(500).send("Server Error");
  }
};

const getTimeOffsExpanded = async (req, res) => {
  console.log("grabbing timeoffs...");

  const teamId = req.params.id;
  const login = await axios(msLoginConfig);
  const token = login.data.access_token;
  const today = new Date().toISOString();

  const toConfig = {
    method: "get",
    url: `https://graph.microsoft.com/v1.0/teams/${teamId}/schedule/timesOff?$filter=sharedTimeOff/startDateTime ge ${today}`,
    headers: {
      "MS-APP-ACTS-AS": msUUID,
      Authorization: `Bearer ${token}`,
    },
  };

  const reasonConfig = (rId) => ({
    method: "get",
    url: `https://graph.microsoft.com/v1.0/teams/${teamId}/schedule/timeOffReasons/${rId}`,
    headers: {
      "MS-APP-ACTS-AS": msUUID,
      Authorization: `Bearer ${token}`,
    },
  });

  const nameConfig = (userId) => ({
    method: "get",
    url: `https://graph.microsoft.com/v1.0/users/${userId}`,
    headers: {
      "MS-APP-ACTS-AS": msUUID,
      Authorization: `Bearer ${token}`,
    },
  });

  try {
    const result = await axios(toConfig);
    const timeOffData = result.data.value;
    console.log(timeOffData);

    const timeOffs = timeOffData.map((t) => ({
      shiftId: t.id,
      userId: t.userId,
      userName: "",
      approvedBy: t.lastModifiedBy.user.displayName,
      start: new Date(t.sharedTimeOff.startDateTime),
      end: new Date(t.sharedTimeOff.endDateTime),
      duration:
        (new Date(t.sharedTimeOff.endDateTime) -
          new Date(t.sharedTimeOff.startDateTime)) /
        86400000,
      timeOffReasonId: t.sharedTimeOff.timeOffReasonId,
      timeOffReason: "",
    }));

    const expandedTimeOffs = [];

    // Fetch reasons and names
    const filledTimeOffs = await Promise.all(
      timeOffs.map(async (item) => {
        const [reasonResult, nameResult] = await Promise.all([
          axios(reasonConfig(item.timeOffReasonId)).catch(() => ({
            data: { displayName: "Unlisted" },
          })),
          axios(nameConfig(item.userId)).catch(() => ({
            data: { displayName: "Unlisted" },
          })),
        ]);
        item.timeOffReason = reasonResult.data.displayName;
        item.userName = nameResult.data.displayName;
        return item;
      })
    );

    // Expand each time-off into daily segments with appropriate end dates
    filledTimeOffs.forEach((item) => {
      if (item.userName !== "Unlisted") {
        let currentDate = new Date(item.start);

        while (currentDate < item.end) {
          let nextDay = new Date(currentDate);
          nextDay.setDate(nextDay.getDate() + 1);

          expandedTimeOffs.push({
            ...item,
            start: new Date(currentDate),
            end: new Date(nextDay), // Set end to the start of the next day
          });

          currentDate = nextDay;
        }
      }
    });

    console.log(expandedTimeOffs);
    res.status(200).send(expandedTimeOffs);
  } catch (error) {
    console.log("error in time off expanded", error);
    res.status(500).send("Server Error");
  }
};

const getShopShifts = async (req, res) => {
  const teamId = process.env.TECH_TEAM_ID;

  try {
    const login = await axios(msLoginConfig);
    const token = login.data.access_token;

    const date = new Date();
    const today = date.toISOString();

    console.log(today);

    const toConfig = {
      method: "get",
      url: `https://graph.microsoft.com/v1.0/teams/${teamId}/schedule/shifts?$filter=sharedShift/startDateTime ge ${today}`,
      headers: {
        "MS-APP-ACTS-AS": msUUID,
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch all shifts data
    const response = await axios(toConfig);

    // // Filter shifts by theme and start date
    const shopShifts = response.data.value.filter((shift) => {
      return shift.sharedShift.theme === "blue";
    });

    const timeConvert = (isoDate) => {
      const date = new Date(isoDate);
      const localString = date.toLocaleString();
      const formattedString = localString.replace(",", "");
      return formattedString;
    };

    const filteredData = shopShifts.map((shift) => {
      return {
        shiftId: shift.id,
        lastModified: timeConvert(shift.lastModifiedDateTime),
        msUserId: shift.userId,
        start: timeConvert(shift.sharedShift.startDateTime),
        end: timeConvert(shift.sharedShift.endDateTime),
      };
    });

    res.json(filteredData);
  } catch (error) {
    console.error("error getting shop shifts", error.response.data);
    res.status(500).send("An error occurred while fetching shifts data.");
  }
};

module.exports = { getTimeOffs, getShopShifts, getTimeOffsExpanded };
