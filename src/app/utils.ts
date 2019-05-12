import * as moment from 'moment';

export class Utils {

    /**
     * Convert the specified date to the backend recognised ISO date format using moment.
     * Its assumes the given date is in the format specified in app settings
     * @param date - date that needs to be converted to ISO date format
     * @param format - the input date format
     */
    public static getBackEndDateFormat(date: any, format: string): any {
        return moment(date, format).format();
    }
    
    /**
     * Format date to the specified date format using moment
     * @param rawDate - date to be formatted (ISO Format)
     * @param format - output date format
     */
    public static getFrontEndDate(rawDate: any, format: any) {
        return moment(rawDate).format(format);
    }
}