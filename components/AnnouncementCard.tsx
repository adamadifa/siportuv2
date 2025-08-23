import { Feather } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

// Fungsi untuk memotong teks
const truncateText = (text: string, maxLength: number = 80): { truncated: string; isLong: boolean } => {
  if (text.length <= maxLength) {
    return { truncated: text, isLong: false };
  }

  // Potong di kata terdekat untuk menghindari pemotongan di tengah kata
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  const finalText = lastSpaceIndex > 60 ? truncated.substring(0, lastSpaceIndex) : truncated;

  return { truncated: finalText + '...', isLong: true };
};

interface AnnouncementCardProps {
  date: string;
  month: string;
  year: string;
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
  year,
  title,
  location,
  category,
  categoryColor,
  content,
  onPress,
}: AnnouncementCardProps) {
  const { truncated, isLong } = truncateText(content, 80);

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
        padding: 16,
        alignItems: 'flex-start',
        marginBottom: 8
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Tanggal & Bulan */}
      <View style={{ alignItems: 'center', marginRight: 16, minWidth: 48 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#18492b', lineHeight: 32 }}>{date}</Text>
        <Text style={{ fontSize: 14, color: '#18492b', marginTop: -2, fontWeight: '600' }}>{month}</Text>
        <Text style={{
          backgroundColor: '#ffe066',
          color: '#18492b',
          fontWeight: 'bold',
          borderRadius: 6,
          paddingHorizontal: 8,
          paddingVertical: 3,
          fontSize: 11,
          marginTop: 8
        }}>{year}</Text>
      </View>

      {/* Konten utama */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4, justifyContent: 'space-between' }}>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 16,
            color: '#18492b',
            flex: 1,
            lineHeight: 22
          }} numberOfLines={2}>{title}</Text>
          <View style={{
            backgroundColor: categoryColor,
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 3,
            marginLeft: 12,
            alignSelf: 'flex-start'
          }}>
            <Text style={{
              color: '#444',
              fontWeight: '600',
              fontSize: 11,
              textTransform: 'capitalize'
            }}>{category}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Feather name="map-pin" size={14} color="#888" style={{ marginRight: 6 }} />
          <Text style={{
            color: '#888',
            fontSize: 12,
            flex: 1,
            fontWeight: '500'
          }} numberOfLines={1}>{location}</Text>
        </View>

        <Text style={{
          color: '#555',
          fontSize: 13,
          lineHeight: 18,
          marginTop: 2
        }}>{truncated}</Text>

        {isLong && (
          <Text style={{
            color: '#18492b',
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
            textDecorationLine: 'underline'
          }}>Baca selengkapnya</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

