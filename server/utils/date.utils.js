const calculateNextGenerateDate = async(lastDate, frequency) => {
  if(!lastDate || isNaN(lastDate.getTime())) {
      console.log("Invalid Date");
      return null; // Return null instead of new Date()
  }

  const nextDate = new Date(lastDate);

  try {
      switch(frequency){
          case 'DAILY':
              nextDate.setDate(nextDate.getDate() + 1);
              break;
          case 'WEEKLY':
              nextDate.setDate(nextDate.getDate() + 7);
              break;
          case 'MONTHLY': 
              // Get the original day of month
              const originalDay = lastDate.getDate();
              
              // Move to next month
              nextDate.setMonth(nextDate.getMonth() + 1);
              
              // Handle cases where the day doesn't exist in the new month
              if (nextDate.getDate() !== originalDay) {
                  // Set to last day of previous month
                  nextDate.setDate(0);
              }
              break;
          case 'QUARTERLY':
              const originalQuarterDay = lastDate.getDate();
              
              // Move 3 months forward
              nextDate.setMonth(nextDate.getMonth() + 3);
              
              // Handle cases where the day doesn't exist
              if (nextDate.getDate() !== originalQuarterDay) {
                  nextDate.setDate(0);
              }
              break;
          case 'HALF_YEARLY':
              const originalHalfYearDay = lastDate.getDate();
              
              // Move 6 months forward
              nextDate.setMonth(nextDate.getMonth() + 6);
              
              // Handle cases where the day doesn't exist
              if (nextDate.getDate() !== originalHalfYearDay) {
                  nextDate.setDate(0);
              }
              break; 
          case 'YEARLY':
              nextDate.setFullYear(nextDate.getFullYear() + 1);
              break;
          default:
              console.warn(`Invalid frequency: ${frequency}, defaulting to DAILY`);
              nextDate.setDate(nextDate.getDate() + 1);
      }
      return nextDate;
  } catch (error) {
      console.error("Error in calculateNextTransactionDate:", error);
      return null;
  }
}

const calculatePreviousDate = async(currentDate, frequency) => {
  if (!currentDate || isNaN(currentDate.getTime())) {
      console.error("Invalid date");
      return null; 
  }
  
  const prevDate = new Date(currentDate);
  
  try {
      switch (frequency) {
          case "DAILY":
              prevDate.setDate(prevDate.getDate() - 1);
              break;
          case "WEEKLY":
              prevDate.setDate(prevDate.getDate() - 7);
              break;
          case "MONTHLY":
              const originalDay = currentDate.getDate();
              prevDate.setMonth(prevDate.getMonth() - 1);
              
              // Handle cases where the day doesn't exist
              if (prevDate.getDate() !== originalDay) {
                  prevDate.setDate(0);
              }
              break;
          case "QUARTERLY":
              const originalQuarterDay = currentDate.getDate();
              prevDate.setMonth(prevDate.getMonth() - 3);
              
              if (prevDate.getDate() !== originalQuarterDay) {
                  prevDate.setDate(0);
              }
              break;
          case "HALF_YEARLY":
              const originalHalfYearDay = currentDate.getDate();
              prevDate.setMonth(prevDate.getMonth() - 6);
              
              if (prevDate.getDate() !== originalHalfYearDay) {
                  prevDate.setDate(0);
              }
              break;
          case "YEARLY":
              prevDate.setFullYear(prevDate.getFullYear() - 1);
              break;
          default:
              prevDate.setDate(prevDate.getDate() - 1);
      }
      return prevDate;
  } catch (err) {
      console.error("Error in calculatePreviousTransactionDate:", err);
      return null;
  }
}

export { calculateNextGenerateDate, calculatePreviousDate };