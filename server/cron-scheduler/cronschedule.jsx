const cron = require("node-cron");
const feedbackmodel = require("../models/feedbackschema");

const scheduleFeedbackStatusUpdate = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running cron job to update feedback statuses...");

    try {
      const currentDate = new Date();

      // Find feedback documents with status 'Active' and enddate in the past
      const result = await feedbackmodel.updateMany(
        {
          status: "Active",
          enddate: { $lt: currentDate },
        },
        {
          $set: { status: "completed" },
        }
      );

      console.log(`Updated ${result.modifiedCount} feedback records to 'completed'.`);
    } catch (error) {
      console.error("Error running cron job:", error);
    }
  });
};

module.exports ={ scheduleFeedbackStatusUpdate};
