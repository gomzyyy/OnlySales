import {Dispatch, SetStateAction} from 'react';
import {SoldProduct} from '../../../../types';

export const months: {[key: string]: string} = {
  jan: 'Jan',
  january: 'Jan',
  '1': 'Jan',

  feb: 'Feb',
  february: 'Feb',
  '2': 'Feb',

  mar: 'Mar',
  march: 'Mar',
  '3': 'Mar',

  apr: 'Apr',
  april: 'Apr',
  '4': 'Apr',

  may: 'May',
  '5': 'May',

  jun: 'Jun',
  june: 'Jun',
  '6': 'Jun',

  jul: 'Jul',
  july: 'Jul',
  '7': 'Jul',

  aug: 'Aug',
  august: 'Aug',
  '8': 'Aug',

  sep: 'Sep',
  sept: 'Sep',
  september: 'Sep',
  '9': 'Sep',

  oct: 'Oct',
  october: 'Oct',
  '10': 'Oct',

  nov: 'Nov',
  november: 'Nov',
  '11': 'Nov',

  dec: 'Dec',
  december: 'Dec',
  '12': 'Dec',
};

export type SearchByDateFnProps = {
  query: string;
  setState: Dispatch<SetStateAction<SoldProduct[]>>;
  state: SoldProduct[];
};
export const handleSearchByDate = ({
  query,
  state,
  setState,
}: SearchByDateFnProps) => {
  const [day, month, year] = query.trim().toLowerCase().split(' ');
  const date = `${day} ${months[month]} ${year}`;
  const filtered = state.filter(sold => {
    const soldDate = new Date(sold.updatedAt).toDateString();
    const soldDateArr = soldDate.split(' ');
    const soldDay = `${soldDateArr[2]} ${soldDateArr[1]} ${soldDateArr[3]}`;
    console.log(soldDay === date);
    return soldDay === date;
  });

  setState(filtered)
};
