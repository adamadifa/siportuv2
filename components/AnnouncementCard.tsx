import { Feather } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

interface AnnouncementCardProps {
  date: string;
  month: string;
  time: string;
  title: string;
  location: string;
  category: string;
  categoryColor: string;
  content: string;
  onPress?: () => void;
}

export default function AnnouncementCard({
  date,
  month,
  time,
  title,
  location,
  category,
  categoryColor,
  content,
  onPress,
}: AnnouncementCardProps) {
  return (
    <TouchableOpacity
      style={{ flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, padding: 14, alignItems: 'center' }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Tanggal & Bulan */}
      <View style={{ alignItems: 'center', marginRight: 16, minWidth: 46 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#18492b', lineHeight: 36 }}>{date}</Text>
        <Text style={{ fontSize: 15, color: '#18492b', marginTop: -2 }}>{month}</Text>
        <Text style={{ backgroundColor: '#ffe066', color: '#18492b', fontWeight: 'bold', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2, fontSize: 13, marginTop: 6 }}>{time}</Text>
      </View>
      {/* Konten utama */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2, justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#18492b' }}>{title}</Text>
          <View style={{ backgroundColor: categoryColor, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginLeft: 8 }}>
            <Text style={{ color: '#444', fontWeight: 'bold', fontSize: 12, textTransform: 'capitalize' }}>{category}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
          <Feather name="map-pin" size={15} color="#888" style={{ marginRight: 5 }} />
          <Text style={{ color: '#888', fontSize: 13 }}>{location}</Text>
        </View>
        <Text style={{ color: '#18492b', fontSize: 14, marginTop: 2 }}>{content}</Text>
      </View>
    </TouchableOpacity>
  );
}

