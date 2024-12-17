require("dotenv").config();
const { Router } = require("express");
const axios = require("axios");
const { stringify } = require("postcss");

const jotformRouter = Router();

jotformRouter.get("/submissions/:id", async (req, res) => {
  const apiKey = process.env.JOTFORM_API_KEY;
  const formId = req.params.id;

  console.log("run");

  try {
    const result = await axios(
      `https://api.jotform.com/form/${formId}/submissions?apikey=${apiKey}`
    );

    const data = result.data.content.map((item) => item.id);
    // const data = result.data.content.map((item) => item.answers);
    // const data = result.data.content;
    // console.log(data.length);

    // let answers = [];

    // data.forEach((item) => {
    //   Object.keys(item).forEach((key) => {
    //     let entry = item[key];
    //     if (entry.name && entry.answer) {
    //       answers.push({
    //         name: entry.name,
    //         answer: entry.answer,
    //       });
    //     }
    //   });
    // });

    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = { jotformRouter };
