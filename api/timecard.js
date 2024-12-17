const { Router } = require("express");
const axios = require("axios");

const timecardRouter = Router();

timecardRouter.post("/minDist", async (req, res) => {
  // const status = req.params["status"];

  try {
    const data = await req.body;

    console.log(data);

    const len = data.rows.length;
    console.log(len);

    function findMinValues(arr) {
      if (arr === undefined) {
        const minValues = {
          address: null,
          distance: null,
        };
        return minValues;
      }

      const minVal = arr.reduce((prev, curr) =>
        prev.distance.value < curr.distance.value ? prev : curr
      );

      const minIndex = arr.findIndex(
        (i) => i.distance.value === minVal.distance.value
      );

      const minAddress = data.destination_addresses[minIndex];

      const minValues = {
        address: minAddress,
        distance: minVal.distance.value,
        duration: minVal.duration.value,
      };

      return minValues;
    }

    function buffer(duration) {
      duration = duration - 180;
      if (duration < 0) {
        return 0;
      } else {
        return duration;
      }
    }

    const result = () => {
      if (len === 1) {
        const arrIn = data.rows[0].elements;
        const inData = findMinValues(arrIn);

        inData.duration = buffer(inData.duration);

        const outData = {
          address: "",
          distance: "",
          duration: "",
        };
        const result = { in: inData, out: outData };
        return result;
      } else {
        const arrIn = data.rows[0].elements;
        const arrOut = data.rows[1].elements;

        const inData = findMinValues(arrIn);
        const outData = findMinValues(arrOut);

        let test = 100;
        console.log(test);
        console.log(buffer(test));

        inData.duration = buffer(inData.duration);
        outData.duration = buffer(outData.duration);

        const result = { in: inData, out: outData };
        return result;
      }
    };

    const final = result();

    res.status(200).send(final);
  } catch (error) {
    console.log("error getting minDist in timecard", error);
    res.status(400).send(error);
  }
});

module.exports = { timecardRouter };
