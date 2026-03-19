import HolidayRepository from "./holiday.repository.js";

class HolidayService {

  static async createHoliday(data){

    if(!data.name || !data.date){
      throw new Error("Holiday name and date are required");
    }

    const holidayId = await HolidayRepository.createHoliday(data);

    return {holidayId};

  }

  static async getHolidays(){

    return HolidayRepository.getHolidays();

  }

  static async updateHoliday(id,data){

    await HolidayRepository.updateHoliday(id,data);

    return {updated:true};

  }

  static async deleteHoliday(id){

    await HolidayRepository.deleteHoliday(id);

    return {deleted:true};

  }

}

export default HolidayService;