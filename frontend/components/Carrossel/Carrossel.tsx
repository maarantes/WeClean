import React, { useRef, useEffect } from 'react';
import { View, Image, Animated, StyleSheet, useWindowDimensions, Easing } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

type CarouselInfinitoProps = {
  imagens: any[];
  itemSize?: number;
  gap?: number;
  velocidade?: number;
  direcao?: 'esquerda' | 'direita';
};

const Carrossel: React.FC<CarouselInfinitoProps> = ({
  imagens,
  itemSize = 56,
  gap = 12,
  velocidade = 10000,
  direcao = 'esquerda',
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const { width: screenWidth } = useWindowDimensions();
  const isFocused = useIsFocused();

  const totalItemWidth = itemSize + gap;

  const itensNaTela = Math.ceil(screenWidth / totalItemWidth) + 1;
  const quantidadeMinima = imagens.length < itensNaTela ? itensNaTela : imagens.length;
  const imagensRepetidas = Array(Math.ceil((quantidadeMinima * 3) / imagens.length))
    .fill(imagens)
    .flat();

  const totalAnimar = totalItemWidth * imagens.length;

  const startAnimation = () => {

    scrollX.setValue(direcao === 'esquerda' ? 0 : -totalAnimar);

    const toValue = direcao === 'esquerda' ? -totalAnimar : 0;

    animationRef.current = Animated.loop(
      Animated.timing(scrollX, {
        toValue,
        duration: velocidade,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animationRef.current.start();
  };

  const stopAnimation = () => {
    animationRef.current?.stop();
  };

  useEffect(() => {
    if (isFocused) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => stopAnimation();
  }, [isFocused, direcao, velocidade, totalAnimar]);

  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <Animated.View
        style={{
          flexDirection: 'row',
          transform: [
            {
              translateX: scrollX,
            },
          ],
        }}
      >
        {imagensRepetidas.map((img, index) => (
          <View
            key={index}
            style={{
              width: itemSize,
              height: itemSize,
              marginRight: gap,
            }}
          >
            <Image
              source={img}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 8,
                resizeMode: 'cover',
              }}
            />
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    paddingTop: 12,
  },
});

export default Carrossel;