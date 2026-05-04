import { Document, Page, Text, View, StyleSheet, pdf, Font } from '@react-pdf/renderer';
import { useStore } from '../store/useStore';
import { useState } from 'react';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: { padding: 15, fontSize: 9, fontFamily: 'Roboto', color: '#000' },
  header: { textAlign: 'center', marginBottom: 6, fontWeight: 'bold', fontSize: 10 },
  subheader: { textAlign: 'center', marginBottom: 10, fontWeight: 'bold', fontSize: 11 },
  row: { flexDirection: 'row', borderBottom: '1px solid #aaa', padding: 3, minHeight: 18 },
  cell: { flex: 1, padding: 2, fontSize: 8.5 },
  bold: { fontWeight: 'bold' },
  ok: { color: '#15803d', fontWeight: 'bold' },
  fail: { color: '#dc2626', fontWeight: 'bold' },
  section: { marginTop: 8, marginBottom: 4, fontWeight: 'bold', fontSize: 9.5 },
  signatureRow: { flexDirection: 'row', marginTop: 12, fontSize: 8.5, gap: 20 }
});

export default function ReportPDF() {
  const { actData, pep, material, weld, reflectors, side } = useStore();
  const [loading, setLoading] = useState(false);
  const isFail = reflectors.some(r => r.status === 'fail');
  const dateStr = new Date().toLocaleDateString('ru-RU');

  const handleDownload = async () => {
    setLoading(true);
    try {
      const doc = (
        <Document>
          <Page size="A4" style={styles.page}>
            <Text style={styles.header}>ООО Аттестационный центр «НАКС-Хабаровск»</Text>
            <Text style={styles.header}>Лаборатория неразрушающего контроля (Свидетельство об аттестации № {actData.certificateNumber})</Text>
            <Text style={styles.subheader}>Акт контроля качества сварных соединений ультразвуковым методом</Text>
            
            <View style={styles.row}>
              <Text style={styles.cell}>№ {actData.actNumber} от {dateStr} г.</Text>
              <Text style={styles.cell}>Заказчик: {actData.customer}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cell}>Наименование ТУ ОПО: {actData.tuOpo}</Text>
              <Text style={styles.cell}>№ программы: {actData.programNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cell}>Способ сварки: {actData.weldingMethod}</Text>
              <Text style={styles.cell}>ФИО сварщика: {actData.welderName} | Клеймо: {actData.welderStamp}</Text>
            </View>

            <Text style={styles.section}>Условия проведения контроля</Text>
            <View style={styles.row}><Text style={styles.cell}>Методика контроля: {actData.methodology}</Text></View>
            <View style={styles.row}>
              <Text style={styles.cell}>Оборудование: {actData.equipment}</Text>
              <Text style={styles.cell}>Свидетельство о поверке: {actData.verificationCert}</Text>
            </View>

            <Text style={styles.section}>Установленные требования</Text>
            <View style={styles.row}>
              <Text style={styles.cell}>Применяемый стандарт: {actData.standard}</Text>
              <Text style={styles.cell}>Критерии оценки: {actData.criteria}</Text>
            </View>

            <Text style={styles.section}>Результаты контроля (Сторона {side})</Text>
            <View style={[styles.row, { backgroundColor: '#f3f4f6' }]}>
              <Text style={[styles.cell, {flex:0.4}]}>№</Text>
              <Text style={styles.cell}>Шифр шва</Text>
              <Text style={styles.cell}>Дата сварки</Text>
              <Text style={styles.cell}>Дата контроля</Text>
              <Text style={styles.cell}>Вид деталей</Text>
              <Text style={styles.cell}>Марка материала</Text>
              <Text style={styles.cell}>ПЭП</Text>
              <Text style={styles.cell}>Описание дефектов</Text>
              <Text style={[styles.cell, {flex:0.8}]}>Оценка</Text>
            </View>
            {reflectors.map((r, i) => (
              <View key={r.id} style={styles.row}>
                <Text style={[styles.cell, {flex:0.4}]}>{i + 1}</Text>
                <Text style={styles.cell}>{r.weldCode || `КСС-${i+1}`}</Text>
                <Text style={styles.cell}>{r.weldDate || '-'}</Text>
                <Text style={styles.cell}>{dateStr}</Text>
                <Text style={styles.cell}>{r.partType || '-'}</Text>
                <Text style={styles.cell}>{material.name}</Text>
                <Text style={styles.cell}>{pep.name.split(' ')[0]} {pep.angle}°</Text>
                <Text style={styles.cell}>{r.desc || `Z=${r.Z} X=${r.X} S=${r.S}`}</Text>
                <Text style={[styles.cell, {flex:0.8}, r.status === 'ok' ? styles.ok : styles.fail]}>
                  {r.status === 'ok' ? 'ГОДЕН' : 'НЕ ГОДЕН'}
                </Text>
              </View>
            ))}

            <Text style={{ marginTop: 12, fontWeight: 'bold', fontSize: 10 }}>
              Итоговая оценка: {isFail ? 'НЕ ГОДЕН' : 'ГОДЕН'}
            </Text>

            <View style={styles.signatureRow}>
              <Text>Контроль выполнил: _______________ / {actData.operatorName || 'ФИО'} / № уд. ______ / {dateStr}</Text>
            </View>
            <View style={styles.signatureRow}>
              <Text>Начальник ЛНК: _______________ / {actData.labHeadName || 'ФИО'} / № уд. ______ / {dateStr}</Text>
            </View>
            <View style={styles.signatureRow}>
              <Text>Член комиссии АЦ: _______________ / {actData.commissionMember || 'ФИО'} / № уд. ______ / {dateStr}</Text>
            </View>
          </Page>
        </Document>
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `UT_Act_${dateStr.replace(/\./g,'-')}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <button disabled={loading} onClick={handleDownload} className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 font-medium">
      {loading ? 'Генерация PDF...' : '📥 Скачать PDF-отчёт'}
    </button>
  );
}
