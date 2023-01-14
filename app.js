import React from 'react';
import * as RN from 'react-native';
import notifee, { TriggerType, EventType, AndroidImportance } from '@notifee/react-native';
import { html } from './render-notification';
import DatePicker from 'react-native-modern-datepicker';
// import Backdrop from './backdrop-blur';

const inputs = [
  { key: 'dia', placeholder: 'Dia' },
  { key: 'mes', placeholder: 'Mês' },
  { key: 'ano', placeholder: 'Ano' },
  { key: 'hora', placeholder: 'Hora' },
  { key: 'minuto', placeholder: 'Minuto' },
];

export default function App() {
  const [fullDate, setFullDate] = React.useState();
  const [value, setValue] = React.useState({
    dia: 0,
    mes: 0,
    ano: 0,
    hora: 0,
    minuto: 0,
  });
  const [selectedDate, setSelectedDate] = React.useState('');

  React.useEffect(() => {
    onDisplayNotification();
    const unsubscribe = () => {
      notifee.onBackgroundEvent(({ type, detail }) => {
        switch (type) {
          case EventType.DISMISSED:
            console.log('User dismissed notification', detail.notification);
            break;
          case EventType.PRESS:
            console.log('User pressed notification', detail.notification);
            break;
        }
      });

      notifee.onForegroundEvent(({ type, detail }) => {
        switch (type) {
          case EventType.DISMISSED:
            console.log('User dismissed notification', detail.notification);
            break;
          case EventType.PRESS:
            console.log('User pressed notification', detail.notification);
            break;
        }
      });
    };

    return () => {
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (typeof selectedDate === 'undefined' || !!!selectedDate) return;
    const [date, time] = selectedDate.split(' ');
    const [ano, mes, dia] = date.split('/');
    const [hora, minuto] = time.split(':');
    const full = new Date(Number(ano), Number(mes) - 1, Number(dia), Number(hora), Number(minuto));
    setFullDate(full);
  }, [selectedDate]);

  async function onDisplayNotification() {
    await notifee.requestPermission();

    // const channelId = await notifee.createChannel({
    //   id: 'alarm',
    //   name: 'Default Channel',
    //   vibration: true,
    //   importance: AndroidImportance.HIGH,
    // });

    // await notifee.displayNotification({
    //   title: 'Notification Title',
    //   body: 'Main body content of the notification',
    //   android: {
    //     channelId,
    //     smallIcon: 'name-of-a-small-icon',
    //     pressAction: {
    //       id: 'default',
    //     },
    //   },
    // });
  }

  async function fnCreateTriggerNotification() {
    const channelId = await notifee.createChannel({
      id: 'alarm',
      name: 'Alarm Channel',
      vibration: true,
      importance: AndroidImportance.HIGH,
    });

    const date = new Date(fullDate || Date.now());
    // date.setDate(value.dia);
    // date.setMonth(value.mes);
    // date.setFullYear(value.ano);
    // date.setHours(value.hora);
    // date.setMinutes(value.minuto);
    // date.setSeconds(0);

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
    };

    const result = await notifee.createTriggerNotification(
      {
        title: 'Agendamento',
        body: html,
        subtitle: 'message',
        android: { channelId },
      },
      trigger,
    );

    console.log(`>>>>>> `, JSON.stringify({ date, result }, null, 2));
  }

  return (
    <RN.View style={styles.container}>
      <RN.View style={styles.form}>
        {/* <RN.View style={styles.row}>
          {inputs.map(item => (
            <RN.TextInput
              key={item.key}
              maxLength={item.key === 'ano' ? 4 : 2}
              style={styles.input}
              keyboardType='numeric'
              placeholder={item.placeholder}
              value={value[item.key]}
              onChangeText={text => setValue({ ...value, [item.key]: Number(text) })}
            />
          ))}
        </RN.View> */}
        <RN.View>
          <DatePicker minuteInterval={1} onSelectedChange={date => setSelectedDate(date)} />
        </RN.View>
        <RN.Button title='Create Trigger Notification' onPress={() => fnCreateTriggerNotification()}></RN.Button>
      </RN.View>
      {/* <RN.View style={styles.boxImage}>
        <Backdrop />
      </RN.View> */}
    </RN.View>
  );
}

const styles = RN.StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
  },
  row: {
    width: '100%',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 4,
    width: '18%',
    marginRight: 5,
  },
  boxImage: {
    height: '77%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
