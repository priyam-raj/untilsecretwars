import fetch from "node-fetch";
import Jimp from "jimp";


// Change this to modify the date. 
let secretWarsDate = "11/07/2025";


async function daysLeft() {

  // Fetch Today's Date
  let today = new Date().toLocaleDateString("en-us", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hours: "numeric",
  });

  let date1 = new Date(today);
  let date2 = new Date(secretWarsDate);


  let Difference_In_Time = date2.getTime() - date1.getTime();
  let daysLeft = (Difference_In_Time / (1000 * 3600 * 24)).toString();

  return daysLeft;
}

async function buildDaysLeftImage() {
  let noOfDays = await daysLeft();

  let daysText;

  if (parseInt(noOfDays) > 1) {
    daysText = "days"
  } else { 
    daysText = "day"
  }

  let font2 = await Jimp.loadFont(`assets/font/avengeance-80.fnt`);
  let font1 = await Jimp.loadFont(`assets/font/avengeance-100.fnt`);


  Jimp.read('assets/background.png', (err, image) => {
    if (err) throw err;
    Jimp.loadFont(`assets/font/avengeance-100.fnt`, (err, font1) => {
      var w = image.bitmap.width;
      var h = image.bitmap.height;
      let text = noOfDays
      var textWidth = Jimp.measureText(font1, text);
      var textHeight = Jimp.measureTextHeight(font1, text);
      var textWidth2 = Jimp.measureText(font2, daysText);
      var textHeight2 = Jimp.measureTextHeight(font2, daysText);
      image
        .print(font1, w/2 - textWidth/2, h/2 - textHeight/2 - 120,
          {   
          text: text,
          }, textWidth, textHeight)
        .print(font2, w/2 - textWidth2/2, textHeight2/2 + 270,
          {   
          text: daysText,
          }, textWidth2, textHeight2)
        .write('daysleft.jpg'); // save
    }); 
  });

  return noOfDays;

}


buildDaysLeftImage()


export { buildDaysLeftImage };
