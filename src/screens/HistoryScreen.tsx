import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useQR} from '../context/QRContext';
import {format} from 'date-fns';
import QRPreviewModal from '../components/QRPreviewModal';
import AdBanner from '../components/AdBanner';

const HistoryScreen = () => {
  const {qrCodes, deleteQRCode, clearHistory} = useQR();
  const [selectedQR, setSelectedQR] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete QR Code',
      'Are you sure you want to delete this QR code?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteQRCode(id),
        },
      ],
    );
  };

  const handleClearAll = () => {
    if (qrCodes.length === 0) {
      Alert.alert('Info', 'No QR codes to clear');
      return;
    }

    Alert.alert(
      'Clear All',
      'Are you sure you want to delete all QR codes?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: clearHistory,
        },
      ],
    );
  };

  const handleItemPress = (text: string) => {
    setSelectedQR(text);
    setShowPreview(true);
  };

  const getTypeIcon = (
    type: string,
  ): {name: string; color: string} => {
    switch (type) {
      case 'url':
        return {name: 'link', color: '#007AFF'};
      case 'email':
        return {name: 'mail', color: '#FF9500'};
      case 'phone':
        return {name: 'call', color: '#34C759'};
      case 'sms':
        return {name: 'chatbubble', color: '#5856D6'};
      case 'wifi':
        return {name: 'wifi', color: '#FF2D55'};
      case 'contact':
        return {name: 'person', color: '#AF52DE'};
      default:
        return {name: 'document-text', color: '#8E8E93'};
    }
  };

  const renderItem = ({item}: any) => {
    const icon = getTypeIcon(item.type);
    
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleItemPress(item.text)}>
        <View style={styles.itemContent}>
          <View style={[styles.iconContainer, {backgroundColor: `${icon.color}20`}]}>
            <Ionicons name={icon.name as any} size={24} color={icon.color} />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.itemText} numberOfLines={2}>
              {item.text}
            </Text>
            <Text style={styles.itemDate}>
              {format(new Date(item.timestamp), 'MMM dd, yyyy • HH:mm')}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={22} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        {qrCodes.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      {qrCodes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={80} color="#C7C7CC" />
          <Text style={styles.emptyText}>No QR codes yet</Text>
          <Text style={styles.emptySubtext}>
            Generated QR codes will appear here
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={qrCodes}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
          
          {/* Ad Banner */}
          <AdBanner />
        </>
      )}

      {/* Preview Modal */}
      <QRPreviewModal
        visible={showPreview}
        qrText={selectedQR}
        onClose={() => {
          setShowPreview(false);
          setSelectedQR('');
        }}
        onSave={() => {
          setShowPreview(false);
          setSelectedQR('');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  clearButton: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 15,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 13,
    color: '#8E8E93',
  },
  deleteButton: {
    padding: 10,
  },
  separator: {
    height: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#C7C7CC',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default HistoryScreen;

