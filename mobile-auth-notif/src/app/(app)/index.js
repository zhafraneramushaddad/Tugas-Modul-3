import { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { getExpoPushToken } from '../../../utils/notifications';
import { simpanPushToken, kirimNotifikasiUji } from '../../../services/notificationService';
import { getTugas, addTugas } from '../../../services/tugasService';

export default function HomeScreen() {
  const { token, user, signOut } = useAuth();
  const [tugas, setTugas] = useState([]);
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  useEffect(() => {
    fetchTugas();
  }, []);

  async function fetchTugas() {
    try {
      const data = await getTugas(token);
      setTugas(data);
    } catch (e) {
      console.log('Gagal muat tugas:', e.message);
    }
  }

  async function handleAddTugas() {
    try {
      await addTugas(token, judul, deskripsi);
      Alert.alert('Sukses', 'Tugas berhasil ditambahkan');
      setJudul(''); setDeskripsi('');
      fetchTugas();
    } catch (e) {
      Alert.alert('Gagal', e.message);
    }
  }

  async function aktifkanNotifikasi() {
    try {
      const expoPushToken = await getExpoPushToken();
      await simpanPushToken(token, expoPushToken);
      Alert.alert('Berhasil', 'Perangkat terdaftar untuk notifikasi');
    } catch (e) {
      Alert.alert('Gagal', e.message);
    }
  }

  async function testNotifikasi() {
    try {
      const data = await kirimNotifikasiUji(token);
      Alert.alert('Server', data.pesan || data.message || 'Berhasil kirim');
    } catch (e) {
      Alert.alert('Gagal', e.message);
    }
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.greeting}>Halo, {user?.nama || 'Pengguna'}</Text>
        <Text style={styles.subGreeting}>Universitas Islam Negeri Sunan Ampel</Text>
      </View>
      <View style={styles.avatar}>
        <Ionicons name="person-circle" size={48} color="#047857" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}

      <FlatList
        data={tugas}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            {/* Notification Center Card */}
            <View style={styles.notifCard}>
              <View style={styles.notifHeader}>
                <Ionicons name="options" size={20} color="#fff" style={{ marginRight: 8 }} />
                <View>
                  <Text style={styles.notifTitle}>Notification Center</Text>
                  <Text style={styles.notifSubtitle}>Smart Notification Engine • Push Service</Text>
                </View>
              </View>
              <View style={styles.notifActionRow}>
                <TouchableOpacity style={styles.btnNotifPrimary} onPress={aktifkanNotifikasi}>
                  <Ionicons name="notifications" size={16} color="#047857" style={{ marginRight: 6 }} />
                  <Text style={styles.btnNotifPrimaryText}>Aktifkan Notifikasi</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnNotifSecondary} onPress={testNotifikasi}>
                  <Ionicons name="paper-plane" size={16} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={styles.btnNotifSecondaryText}>Tes Kirim Push</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Task Form Card */}
            <View style={styles.formCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Ionicons name="checkmark-done-circle" size={24} color="#047857" style={{ marginRight: 8 }} />
                <Text style={styles.sectionTitle}>Tugas Mandiri</Text>
              </View>

              <Text style={styles.inputLabel}>Judul Tugas</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Contoh: Laporan Akhir Sistem Distribusi" 
                value={judul} 
                onChangeText={setJudul} 
              />

              <Text style={styles.inputLabel}>Deskripsi Singkat</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="Tuliskan catatan, deadline, atau instruksi dosen..." 
                value={deskripsi} 
                onChangeText={setDeskripsi} 
                multiline={true}
              />

              <TouchableOpacity style={styles.btnSubmit} onPress={handleAddTugas}>
                <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.btnSubmitText}>Tambah Tugas</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Daftar Tugas Anda</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <View style={styles.taskIcon}>
              <Ionicons name="document-text" size={20} color="#047857" />
            </View>
            <View style={styles.taskContent}>
              <Text style={styles.taskTitle}>{item.judul}</Text>
              <Text style={styles.taskDesc}>{item.deskripsi}</Text>
            </View>
          </View>
        )}
      />

      {/* Bottom Navigation (Logout) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#047857" />
          <Text style={[styles.navText, { color: '#047857' }]}>Beranda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={signOut}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text style={[styles.navText, { color: '#EF4444' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', paddingHorizontal: 20, paddingTop: 50 },
  
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  subGreeting: { fontSize: 13, color: '#047857', fontWeight: '600', marginTop: 2 },
  avatar: { backgroundColor: '#D1FAE5', borderRadius: 24 },

  notifCard: { backgroundColor: '#047857', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, marginBottom: 24 },
  notifHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  notifTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  notifSubtitle: { color: '#A7F3D0', fontSize: 12, marginTop: 2 },
  notifActionRow: { flexDirection: 'row', gap: 12 },
  btnNotifPrimary: { flex: 1, backgroundColor: '#ffffff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: 8 },
  btnNotifPrimaryText: { color: '#047857', fontWeight: 'bold', fontSize: 13 },
  btnNotifSecondary: { flex: 1, backgroundColor: '#065F46', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#34D399' },
  btnNotifSecondaryText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },

  formCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#111827' },
  textArea: { height: 80, textAlignVertical: 'top' },
  btnSubmit: { backgroundColor: '#047857', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 8, marginTop: 20 },
  btnSubmitText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },

  taskItem: { backgroundColor: '#ffffff', flexDirection: 'row', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  taskIcon: { backgroundColor: '#D1FAE5', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  taskContent: { flex: 1, justifyContent: 'center' },
  taskTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  taskDesc: { fontSize: 13, color: '#6B7280' },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 11, fontWeight: '600', marginTop: 4 }
});