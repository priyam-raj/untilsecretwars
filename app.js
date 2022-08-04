import express from "express";
import { CronJob } from "cron";
import dotenv from "dotenv";
import { TwitterApi } from "twitter-api-v2";
import { IgApiClient } from "instagram-private-api";
import { promisify } from "util";
import { buildDaysLeftImage } from "./assembleImage.js";
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


    // Set 3 second delay (For compressions and resizes.)
function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
    
  
  async function tweetNow() {
    console.log("Tweeting begins..");
    let caption = await buildDaysLeftImage();
    caption = `📅 ${caption} days left until #AvengersSecretWars.`;   
  
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
      console.log("Posting to Instagram begins..");
      // Instagram client
      const { username, password } = process.env;
      const ig = new IgApiClient();
      let caption = await buildDaysLeftImage();
      caption = `📅 ${caption} days left until Avengers: Secret Wars.\n\n#avengers #marvel #spiderman #avengerssecretwars #kangdynasty #kang #marvel #mcu #avengersendgame #captainamerica #thor #marvelcomics #blackwidow #hulk #marvelstudios #avengersinfinitywar #comics #secretwars #loki #marveluniverse #marvelcinematicmultiverse #marvelcinematicuniverse #avengersassemble`;
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
    "0 12 * * *",
    function () {
      console.log("Auto post to Instagram begins..");
      instagramPost();
      tweetNow();
      },
    true
  );
  
  
  
  dailyPost.start();
  console.log('Successfully started, now tweeting and posting to Instagram!');
  