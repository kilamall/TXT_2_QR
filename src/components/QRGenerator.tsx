import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRGeneratorProps {
  value: string;
  size?: number;
  logo?: any;
  backgroundColor?: string;
  color?: string;
  getRef?: (ref: any) => void;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({
  value,
  size = 250,
  logo,
  backgroundColor = 'white',
  color = 'black',
  getRef,
}) => {
  const qrRef = useRef<any>(null);

  React.useEffect(() => {
    if (getRef && qrRef.current) {
      getRef(qrRef.current);
    }
  }, [getRef]);

  return (
    <View style={styles.container}>
      <QRCode
        value={value || 'Empty'}
        size={size}
        logo={logo}
        backgroundColor={backgroundColor}
        color={color}
        getRef={(c: any) => {
          qrRef.current = c;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});

export default QRGenerator;

