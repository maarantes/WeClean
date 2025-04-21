import React, { useEffect, useRef, useState } from "react";
import { View, Text } from "react-native";
import * as Animatable from "react-native-animatable";
import { styles } from "./styles";

interface AlertaSimplesProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const AlertaSimples: React.FC<AlertaSimplesProps> = ({ visible, message, onClose }) => {
  const viewRef = useRef<Animatable.View & View>(null);
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      viewRef.current?.animate("slideInUp", 250);
      const timer = setTimeout(() => {
        viewRef.current
          ?.animate("slideOutDown", 250)
          .then(() => {
            setShouldRender(false);
            onClose();
          });
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      viewRef.current?.animate("slideOutDown", 500).then(() => setShouldRender(false));
    }
  }, [visible, onClose]);

  if (!shouldRender) return null;

  return (
    <Animatable.View ref={viewRef} style={styles.alerta_container}>
      <Text style={styles.alerta_texto}>{message}</Text>
    </Animatable.View>
  );
};

export default AlertaSimples;