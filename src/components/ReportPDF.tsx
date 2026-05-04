import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { useStore } from '../store/useStore';

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10, fontFamily: 'Helvetica' },
  header: { textAlign: 'center', marginBottom: 8, fontWeight: 'bold', fontSize: 12 },
  row: { flexDirection: 'row', borderBottom: '1px solid #ccc', padding: 4 },
  cell: { flex: 1, padding: 2 },
  ok: { color: '#16a34a', fontWeight: 'bold' },
  fail: { color: '#dc2626', fontWeight: 'bold' },
  section: { marginTop: 10, marginBottom: 5, fontWeight: 'bold' }
});

export default function ReportPDF() {
  const { pep, material, weld, reflectors } = useStore();
  const isFail = reflectors.some(r => r.status === 'fail');
  const dateStr = new Date().toLocaleDateString('ru-RU');

  return (
    <PDFDownloadLink document={
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.header}>ООО АЦ «НАКС-Хабаровск» ЛНК</Text>
          <Text style={styles.header}>Акт контроля качества сварных соединений ультразвуковым методом</Text>
          <View style={styles.row}>
            <Text style={styles.cell}>№ ____ от {dateStr} г.</Text>
            <Text style={styles.cell}>Заказчик: _______________</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Материал: {material.name}</Text>
            <Text style={styles.cell}>Толщина: {weld.H} мм</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>ПЭП: {pep.name}</Text>
            <Text style={styles.cell}>Угол: {pep.angle}° | Частота: {pep.freq} МГц</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Оборудование: УД А1212 МАСТЕР</Text>
            <Text style={styles.cell}>Поверка: № ПОВ-XXX/123456/ДД-ММ-ГГГГ</Text>
          </View>
          
          <Text style={styles.section}>Результаты контроля:</Text>
          {reflectors.map((r, i) => (
            <View key={r.id} style={styles.row}>
              <Text style={[styles.cell, {flex:0.5}]}>{i + 1}</Text>
              <Text style={styles.cell}>Шифр шва: КСС-{i+1}</Text>
              <Text style={styles.cell}>X={r.x} Y={r.y}</Text>
              <Text style={styles.cell}>{r.desc || '—'}</Text>
              <Text style={[styles.cell, r.status === 'ok' ? styles.ok : styles.fail]}>
                {r.status === 'ok' ? 'ГОДЕН' : 'НЕ ГОДЕН'}
              </Text>
            </View>
          ))}
          
          <Text style={{ marginTop: 15, fontWeight: 'bold', fontSize: 11 }}>
            Итоговая оценка: {isFail ? 'НЕ ГОДЕН' : 'ГОДЕН'}
          </Text>
          <Text style={{ marginTop: 20 }}>Оператор: _______________ / ФИО / № уд. / Дата</Text>
          <Text style={{ marginTop: 5 }}>Начальник ЛНК: _______________ / ФИО / № уд. / Дата</Text>
        </Page>
      </Document>
    } fileName={`UT_Report_${dateStr.replace(/\./g,'-')}.pdf`}>
      {({ loading }) => (
        <button disabled={loading} className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Генерация PDF...' : '📥 Скачать PDF-отчёт'}
        </button>
      )}
    </PDFDownloadLink>
  );
}
