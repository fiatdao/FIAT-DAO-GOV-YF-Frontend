import Icon from 'components/custom/icon';
import { Text } from 'components/custom/typography';

import PrizeItem from '../prizes-item';

import s from '../../views/age-of-romulus/s.module.scss';

export const PrizesData = [
  {
    key: 'corona',
    date: '20 Dec 2021 00:00:00 GMT',
    icon: <Icon name="png/roman-corona" width="60" height="auto" />,
    title: 'roman corona',
    rate: 5,
  },
  {
    key: 'gladius',
    date: '13 Dec 2021 00:00:00 GMT',
    icon: <Icon name="png/roman-gladius" width="60" height="auto" />,
    title: 'Roman gladius',
    rate: 10,
  },
  {
    key: 'galea',
    date: '6 Dec 2021 00:00:00 GMT',
    icon: <Icon name="png/roman-galea" width="60" height="auto" />,
    title: 'roman galea',
    rate: 25,
  },
  {
    key: 'kithara',
    date: '29 Nov 2021 00:00:00 GMT',
    icon: <Icon name="png/roman-kithara" width="60" height="auto" />,
    title: 'roman kithara',
    rate: 50,
  },
  {
    key: 'amphora',
    date: '22 Nov 2021 00:00:00 GMT',
    icon: <Icon name="png/roman-amphora" width="60" height="auto" />,
    title: 'roman amphora',
    rate: null,
  },
];

const PrizesView = ({
                      countAllUsers,
                      activeKey,
                    }: {
  countAllUsers: number | null;
  activeKey: string;
}) => {

  return (
    <div>
      <div className={s.card}>
        <Text type="h3" color="primary" className="mb-16">
          Prizes
        </Text>

        <div className={s.card__table}>
          {PrizesData.map(({ key, title, date, icon, rate }) => (
            <PrizeItem key={key} keyItem={key} title={title} date={date} icon={icon} rate={rate} countAllUsers={countAllUsers} activeKey={activeKey} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrizesView;
