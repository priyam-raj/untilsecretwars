import express from "express";
import { CronJob } from "cron";
import dotenv from "dotenv";
import { TwitterApi } from "twitter-api-v2";
import { IgApiClient } from "instagram-private-api";
import { promisify } from "util";
import { buildDaysLeftImage, daysLeft } from "./assembleImage.js";
import { readFile } from "fs";


const app = express();
const readFileAsync = promisify(readFile);
dotenv.config();

  app.use(express.static("public"));
  app.listen(process.env.PORT || 3000, function () {
  });

  app.get("/", function (request, response) {
    response.send('untilsecretwars is currently up and running <br><br> - Instagram @untilsecretwars<br> - Twitter @untilsecretwars');
  });
    
  
  async function tweetNow() {
    console.log("Tweeting begins..");
    let caption = await buildDaysLeftImage();
    let secretWarsDate = await daysLeft();
    secretWarsDate = secretWarsDate[2];

    caption = `📅 ${caption} days left until #AvengersSecretWars.\n The movie is current expected to come out on ${secretWarsDate}.`;   
  
      const client = new TwitterApi({
        appKey: process.env.CONSUMER_KEY,
        appSecret: process.env.CONSUMER_SECRET,
        accessToken: process.env.ACCESS_TOKEN,
        accessSecret: process.env.ACCESS_TOKEN_SECRET,
      });
    
    const untilsecretwars = client.readWrite;
    const imagePath = `daysleft.jpg`
  
    const tweet = async () => {
      try { 
        const mediaId = await client.v1.uploadMedia(imagePath);
        await untilsecretwars.v2.tweet(caption, {
          media: { media_ids: [mediaId] },
        });
        console.log("Tweeted to Twitter!");
      } catch (e) {
        console.log(e);
      }
    };
    await tweet();
  }
  

  async function instagramPost() {
    try {
      let secretWarsDate = await daysLeft();
      secretWarsDate = secretWarsDate[2];  
      console.log("Posting to Instagram begins..");
      // Instagram client
      const { username, password } = process.env;
      const ig = new IgApiClient();
      let caption = await buildDaysLeftImage();
      caption = `📅 ${caption} days left until Avengers: Secret Wars.\nThe movie is currently expected to come out on ${secretWarsDate}.\n\n#avengers #marvel #avengerssecretwars #kangdynasty #kang #marvel #mcu #avengersendgame #marvelstudios #secretwars #loki #marveluniverse #marvelcinematicmultiverse #avengersassemble`;
      ig.state.generateDevice(username);
      const user = await ig.account.login(username, password);
      const path = `daysleft.jpg`;
      const published = await ig.publish.photo({
        file: await readFileAsync(path),
        caption: caption,
      });
      console.log("Posted to Instagram!");
    } catch (error) {
      console.log(error);
    }
  }
  
  // Run on every day at 12 PM IST
  let dailyPost = new CronJob(
    "30 6 * * *",
    async function () {
      console.log("Auto post to Instagram begins..");
      await instagramPost();
      await tweetNow();
      },
    true
  );

  

  dailyPost.start();
  console.log('Successfully started, now tweeting and posting to Instagram!');
  