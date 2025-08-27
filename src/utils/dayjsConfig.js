//
// import dayjs from '@/utils/dayjsConfig';
// dayjs(ev.occurs_at).format('D MMM'); // always consistent/
//
//

// utils/dayjsConfig.js
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import 'dayjs/locale/de'; // or your locale

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);
dayjs.locale('en'); // or 'en'

export default dayjs;
