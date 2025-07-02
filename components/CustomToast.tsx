import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const getToastStyle = (type: string) => {
  switch (type) {
    case 'success':
      return { backgroundColor: '#e6f4ea', borderColor: '#6fcf97', icon: 'check-circle', iconColor: '#219653' };
    case 'error':
      return { backgroundColor: '#fdeaea', borderColor: '#eb5757', icon: 'x-circle', iconColor: '#eb5757' };
    case 'info':
      return { backgroundColor: '#eaf6fd', borderColor: '#2f80ed', icon: 'info', iconColor: '#2f80ed' };
    case 'warning':
      return { backgroundColor: '#fffbe5', borderColor: '#f2c94c', icon: 'alert-triangle', iconColor: '#f2c94c' };
    default:
      return { backgroundColor: '#fff', borderColor: '#e0e0e0', icon: 'info', iconColor: '#888' };
  }
};

export const CustomToast = ({ text1, text2, type, onPress, ...rest }: any) => {
  const style = getToastStyle(type);
  return (
    <View style={[styles.toast, { backgroundColor: style.backgroundColor, borderColor: style.borderColor }]}> 
      <Feather name={style.icon as any} size={24} color={style.iconColor} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: style.iconColor }]}>{text1}</Text>
        {text2 ? <Text style={styles.text}>{text2}</Text> : null}
      </View>
      <TouchableOpacity onPress={onPress} style={{ marginLeft: 8 }}>
        <Feather name="x" size={22} color="#aaa" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 12,
    marginTop: 18,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
    minHeight: 60,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  text: {
    fontSize: 14,
    color: '#444',
  },
});
