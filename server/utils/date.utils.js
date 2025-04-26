const calculateNextGenerateDate = async(lastDate, frequency) => {

    if(!lastDate || isNaN(lastDate.getTime())) {
        console.log("Invalid Date");
        return new Date();
    }

    const nextDate = new Date(lastDate);

    try {
        switch(frequency){
            case 'DAILY' :
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            case 'WEEKLY' :
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case 'MONTHLY' : 
                const currentMonth = new Date().getMonth()
                nextDate.setDate(currentMonth + 1);

                if(nextDate.getMonth() !== (currentMonth + 1) % 12){
                    nextDate.setDate(0)
                }
                break;
            case 'QUATERLY' :
                const currentQuarterlyMonth = new Date().getMonth();
                nextDate.setDate(currentQuarterlyMonth + 3);

                if(nextDate.getMonth() !== (currentQuarterlyMonth + 1) % 12){
                    nextDate.setDate(0);
                }
                break;
            case 'HALF_YEARLY' :
                const currentHalfYearlyMonth = new Date();
                nextDate.setDate(currentHalfYearlyMonth + 6);

                if(nextDate.getMonth() !== (currentHalfYearlyMonth + 6) % 12){
                    nextDate.setDate(0)
                }
                break; 
            case 'YEARLY' :
                nextDate.setDate(nextDate.getFullYear() + 1);
                break;
            default :
                console.warn(`Invalid frequency: ${frequency}, defaulting to DAILY`);
                nextDate.setDate(nextDate.getMonth() + 1);
        }
        return nextDate;
    } catch (error) {
        console.error("Error in calculateNextTransactionDate:", err);
        return null;
    }
}

const calculatePreviousDate = async(currentDate, frequency) => {
    if (!currentDate || isNaN(currentDate.getTime())) {
        console.error("Invalid date");
        return new Date(); 
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
            prevDate.setMonth(prevDate.getMonth() - 1);
            break;
          case "QUATERLY":
            prevDate.setMonth(prevDate.getMonth() - 3);
            break;
          case "HALFERLY":
            prevDate.setMonth(prevDate.getMonth() - 6);
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
        return new Date();
      }
}


export {
    calculateNextGenerateDate,
    calculatePreviousDate
}