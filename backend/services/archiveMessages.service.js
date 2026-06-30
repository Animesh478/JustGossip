const cron = require("node-cron");
const { Message, ArchivedMessages, sequelize } = require("../models/index");
const { Op } = require("sequelize");

// schedule the job to run every day at 3:00 AM
cron.schedule("0 3 * * *", async () => {
  console.log("Starting nightly message archival process...");

  // define the cut-off date
  const cutOffDate = new Date();
  cutOffDate.setDate(cutOffDate.getDate - 30);

  try {
    // archiving should be done in a transaction, such that if the archiving process fails halfway, then the entire thing rolls back and no data is lost
    await sequelize.transaction(async (t) => {
      // find all the messages older than the cutoff date
      const oldMessages = Message.findAll({
        where: {
          createdAt: { [Op.lt]: cutOffDate },
        },
        raw: true,
        transaction: t,
      });

      if (oldMessages.length === 0) {
        console.log("No messages to archive");
        return;
      }

      // insert those messages into the archived messages table
      await ArchivedMessages.bulkCreate(oldMessages, { transaction: t });

      // delete those old messages from the message table
      await Message.destroy({
        where: {
          createdAt: {
            [Op.lt]: cutOffDate,
          },
        },
        transaction: t,
      });

      console.log("Successfully archived ", oldMessages.length, " messages");
    });
  } catch (error) {
    console.error("Archival process failed: ", error);
  }
});

// const archiveOlderMessages = async function () {
//   // define the cut-off date
//   const cutOffDate = new Date();
//   cutOffDate.setDate(cutOffDate.getDate - 30);

//   try {
//     // archiving should be done in a transaction, such that if the archiving process fails halfway, then the entire thing rolls back and no data is lost
//     await sequelize.transaction(async (t) => {
//       // find all the messages older than the cutoff date
//       const oldMessages = Message.findAll({
//         where: {
//           createdAt: { [Op.lt]: cutOffDate },
//         },
//         raw: true,
//         transaction: t,
//       });

//       if (oldMessages.length === 0) {
//         console.log("No messages to archive");
//         return;
//       }

//       // insert those messages into the archived messages table
//       await ArchivedMessages.bulkCreate(oldMessages, { transaction: t });

//       // delete those old messages from the message table
//       await Message.destroy({
//         where: {
//           createdAt: {
//             [Op.lt]: cutOffDate,
//           },
//         },
//         transaction: t,
//       });

//       console.log("Successfully archived ", oldMessages.length, " messages");
//     });
//   } catch (error) {
//     console.error("Archival process failed: ", error);
//   }
// };
