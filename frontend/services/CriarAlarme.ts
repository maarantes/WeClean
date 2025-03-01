import Alarm from "react-native-alarm-manager";

export const definirAlarme = async (horario: string) => {
  const [horas, minutos] = horario.split(":").map(Number);

  const agora = new Date();
  const dataFormatada = `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:00 ${agora.getFullYear()}-${(agora.getMonth() + 1).toString().padStart(2, "0")}-${agora.getDate().toString().padStart(2, "0")}`;

  const alarme = {
    alarm_time: dataFormatada,
    alarm_title: "Alarme Programado",
    alarm_text: "Está na hora da sua tarefa!",
    alarm_sound: "alarme",
    alarm_icon: "icone_alarme",
    alarm_sound_loop: true,
    alarm_vibration: true,
    alarm_noti_removable: true,
    alarm_activate: true,
  };

  Alarm.schedule(
    alarme,
    (sucesso) => console.log("Alarme agendado com sucesso:", sucesso),
    (erro) => console.error("Erro ao agendar o alarme:", erro)
  );
};
