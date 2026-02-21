import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  Animated,
  Easing,
  useWindowDimensions,
  Alert,
  SafeAreaView,
  Platform,
  TextInput,
  Keyboard,
  Modal,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

const BG = require('../gallery/launch_bg.png');
const EMPTY_BIRD = require('../gallery/onb_bird.png');

type Entry = {
  id: string;
  createdAt: number;
  name: string;
  notes: string;
  photoUri?: string;
};

const STORAGE_KEY = 'trail_journal_entries_v1';

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function fmtDate(ts: number) {
  const d = new Date(ts);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = d.toLocaleString('en-US', { month: 'short' });
  const yy = d.getFullYear();
  return `${dd} ${mm} ${yy}`;
}

type FocusField = 'name' | 'notes' | null;

export default function TrailJournalScreen() {
  const { width, height } = useWindowDimensions();
  const isSmall = height <= 700;

  const [items, setItems] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);

  const [focused, setFocused] = useState<FocusField>(null);

  const [selName, setSelName] = useState<{ start: number; end: number }>({ start: 0, end: 0 });
  const [selNotes, setSelNotes] = useState<{ start: number; end: number }>({ start: 0, end: 0 });

  const nameRef = useRef<TextInput>(null);
  const notesRef = useRef<TextInput>(null);
  const modalScrollRef = useRef<ScrollView>(null);

  const appear = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

  const sidePad = isSmall ? 16 : 18;
  const cardW = useMemo(() => clamp(width - sidePad * 2, 310, 680), [width, sidePad]);
  const topGap = 20 + (Platform.OS === 'android' ? 20 : 0);
  const listBottomPad = 120;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const data: Entry[] = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
    appear.stopAnimation();
    appear.setValue(0);
    Animated.timing(appear, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [load, appear]);

  const openModal = (mode: 'add' | 'edit', entry?: Entry) => {
    if (mode === 'add') {
      setEditingId(null);
      setName('');
      setNotes('');
      setPhotoUri(undefined);
      setSelName({ start: 0, end: 0 });
      setSelNotes({ start: 0, end: 0 });
    } else if (entry) {
      setEditingId(entry.id);
      setName(entry.name ?? '');
      setNotes(entry.notes ?? '');
      setPhotoUri(entry.photoUri);
      const nLen = (entry.name ?? '').length;
      const tLen = (entry.notes ?? '').length;
      setSelName({ start: nLen, end: nLen });
      setSelNotes({ start: tLen, end: tLen });
    }

    setFocused(null);
    setModalVisible(true);

    modalAnim.stopAnimation();
    modalAnim.setValue(0);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      requestAnimationFrame(() => modalScrollRef.current?.scrollTo({ y: 0, animated: false }));
    });
  };

  const closeModal = () => {
    setFocused(null);
    Keyboard.dismiss();
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setModalVisible(false);
    });
  };

  const canSave = name.trim().length > 0 || notes.trim().length > 0 || !!photoUri;

  const pickPhoto = async () => {
    try {
      const res = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        includeBase64: false,
        quality: 0.9,
      });
      if (res.didCancel) return;
      const uri = res.assets?.[0]?.uri;
      if (!uri) return;
      setPhotoUri(uri);
    } catch {
      Alert.alert('Photo', 'Could not open the gallery.');
    }
  };

  const removePhoto = () => {
    if (!photoUri) return;
    Alert.alert('Remove photo?', 'This will remove the selected photo.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setPhotoUri(undefined) },
    ]);
  };

  const saveEntry = async () => {
    if (!canSave) return;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const prev: Entry[] = raw ? JSON.parse(raw) : [];

      if (editingId) {
        const next = prev.map((x) =>
          x.id === editingId ? { ...x, name: name.trim(), notes: notes.trim(), photoUri: photoUri || undefined } : x
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setItems(next);
      } else {
        const entry: Entry = {
          id: uid(),
          createdAt: Date.now(),
          name: name.trim(),
          notes: notes.trim(),
          photoUri: photoUri || undefined,
        };
        const next = [entry, ...prev];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setItems(next);
      }

      closeModal();
    } catch {
      Alert.alert('Save failed', 'Could not save the entry.');
    }
  };

  const deleteEntry = (entry: Entry) => {
    Alert.alert('Delete this note?', 'This will remove the note from your journal.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const next = items.filter((x) => x.id !== entry.id);
          setItems(next);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        },
      },
    ]);
  };

  const modalCardW = useMemo(() => clamp(width - (isSmall ? 34 : 44), 300, 560), [width, isSmall]);
  const modalPad = isSmall ? 18 : 22;

  const inputH = isSmall ? 46 : 52;
  const notesH = isSmall ? 118 : 150;

  const KB_H = isSmall ? 230 : 260;
  const showKeyboard = modalVisible && focused !== null;

  const cardMaxH = useMemo(() => {
    const base = height - (isSmall ? 90 : 120);
    return clamp(base, isSmall ? 520 : 620, 860);
  }, [height, isSmall]);

  const contentMaxH = useMemo(() => {
    const kb = showKeyboard ? KB_H : 0;
    const topBottomPads = modalPad * 2;
    return clamp(cardMaxH - topBottomPads - kb, 240, 800);
  }, [cardMaxH, modalPad, showKeyboard, KB_H]);

  const photoSize = useMemo(() => {
    const base = modalCardW - modalPad * 2;
    const wBased = clamp(Math.round(base * (isSmall ? 0.42 : 0.4)), 120, 210);
    return clamp(wBased, 110, isSmall ? 185 : 210);
  }, [modalCardW, modalPad, isSmall]);

  const aOpacity = appear.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const aShift = appear.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });

  const mOpacity = modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const mShift = modalAnim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
  const mScale = modalAnim.interpolate({ inputRange: [0, 1], outputRange: [0.985, 1] });

  const focusName = () => {
    setFocused('name');
    requestAnimationFrame(() => nameRef.current?.focus());
    requestAnimationFrame(() => modalScrollRef.current?.scrollTo({ y: 0, animated: true }));
  };
  const focusNotes = () => {
    setFocused('notes');
    requestAnimationFrame(() => notesRef.current?.focus());
    requestAnimationFrame(() => modalScrollRef.current?.scrollTo({ y: 140, animated: true }));
  };

  const getSelection = () => (focused === 'name' ? selName : selNotes);
  const setSelection = (next: { start: number; end: number }) => {
    if (focused === 'name') setSelName(next);
    else setSelNotes(next);
  };
  const getValue = () => (focused === 'name' ? name : notes);
  const setValue = (v: string) => {
    if (focused === 'name') setName(v);
    else setNotes(v);
  };

  const insertAtCaret = (txt: string) => {
    if (!focused) return;
    const v = getValue();
    const sel = getSelection();
    const a = Math.min(sel.start, sel.end);
    const b = Math.max(sel.start, sel.end);
    const next = v.slice(0, a) + txt + v.slice(b);
    const caret = a + txt.length;
    setValue(next);
    setSelection({ start: caret, end: caret });
  };

  const backspaceAtCaret = () => {
    if (!focused) return;
    const v = getValue();
    const sel = getSelection();
    const a = Math.min(sel.start, sel.end);
    const b = Math.max(sel.start, sel.end);

    if (a !== b) {
      const next = v.slice(0, a) + v.slice(b);
      setValue(next);
      setSelection({ start: a, end: a });
      return;
    }
    if (a <= 0) return;
    const next = v.slice(0, a - 1) + v.slice(a);
    const caret = a - 1;
    setValue(next);
    setSelection({ start: caret, end: caret });
  };

  const clearFocused = () => {
    if (!focused) return;
    setValue('');
    setSelection({ start: 0, end: 0 });
  };

  const okKeyboard = () => {
    setFocused(null);
    Keyboard.dismiss();
  };

  const row1 = useMemo(() => 'QWERTYUIOP'.split(''), []);
  const row2 = useMemo(() => 'ASDFGHJKL'.split(''), []);
  const row3 = useMemo(() => 'ZXCVBNM'.split(''), []);

  const kbKeyH = isSmall ? 32 : 34;
  const kbPad = isSmall ? 10 : 12;

  const CustomKeyboard = (
    <View style={[s.kbWrap, { height: KB_H, padding: kbPad }]}>
      <View style={s.kbTopRow}>
        <Text style={s.kbTitle}>Keyboard</Text>
        <Text style={s.kbTarget}>→ {focused === 'name' ? 'Name' : 'Notes'}</Text>
      </View>

      <View style={s.kbRow}>
        {row1.map((k) => (
          <Pressable
            key={k}
            onPress={() => insertAtCaret(k)}
            style={({ pressed }) => [s.kbKey, { height: kbKeyH }, pressed && { opacity: 0.85 }]}
          >
            <Text style={s.kbKeyText}>{k}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[s.kbRow, { marginTop: 8 }]}>
        {row2.map((k) => (
          <Pressable
            key={k}
            onPress={() => insertAtCaret(k)}
            style={({ pressed }) => [s.kbKey, { height: kbKeyH }, pressed && { opacity: 0.85 }]}
          >
            <Text style={s.kbKeyText}>{k}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[s.kbRow, { marginTop: 8 }]}>
        <Pressable
          onPress={backspaceAtCaret}
          style={({ pressed }) => [s.kbFunc, { height: kbKeyH }, pressed && { opacity: 0.85 }]}
        >
          <Text style={s.kbFuncText}>⌫</Text>
        </Pressable>

        {row3.map((k) => (
          <Pressable
            key={k}
            onPress={() => insertAtCaret(k)}
            style={({ pressed }) => [s.kbKey, { height: kbKeyH }, pressed && { opacity: 0.85 }]}
          >
            <Text style={s.kbKeyText}>{k}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[s.kbRow, { marginTop: 10 }]}>
        <Pressable
          onPress={() => insertAtCaret(' ')}
          style={({ pressed }) => [s.kbSpace, { height: kbKeyH }, pressed && { opacity: 0.85 }]}
        >
          <Text style={s.kbSpaceText}>Space</Text>
        </Pressable>
      </View>

      <View style={[s.kbRow, { marginTop: 10 }]}>
        <Pressable
          onPress={clearFocused}
          style={({ pressed }) => [s.kbAction, { height: kbKeyH }, pressed && { opacity: 0.85 }]}
        >
          <Text style={s.kbActionText}>Clear</Text>
        </Pressable>

        <Pressable
          onPress={okKeyboard}
          style={({ pressed }) => [s.kbOk, { height: kbKeyH }, pressed && { opacity: 0.9 }]}
        >
          <Text style={s.kbOkText}>OK</Text>
        </Pressable>
      </View>

      <Text style={s.kbHint}>Tap keys to type • Cursor stays in the selected field</Text>
    </View>
  );

  return (
    <View style={s.root}>
      <Image source={BG} style={s.bg} resizeMode="cover" />
      <View style={s.dark} />

      <SafeAreaView style={s.safe}>
        <Animated.View style={[s.layer, { opacity: aOpacity, transform: [{ translateY: aShift }] }]}>
          <View style={{ height: topGap }} />

          <View style={[s.headerRow, { paddingHorizontal: sidePad }]}>
            <Text style={[s.hTitle, { fontSize: isSmall ? 18 : 20 }]}>Trail Journal</Text>
          </View>

          {!loading && items.length === 0 ? (
            <View style={s.emptyWrap}>
              <Image
                source={EMPTY_BIRD}
                style={[
                  s.emptyImg,
                  { width: cardW * 0.58, height: cardW * 0.58, marginBottom: isSmall ? 10 : 14 },
                ]}
                resizeMode="contain"
              />
              <Text style={[s.emptyTitle, { fontSize: isSmall ? 18 : 20 }]}>No notes yet</Text>
              <Text style={[s.emptySub, { fontSize: isSmall ? 12 : 13 }]}>
                Add your first journal note. Photo is optional.
              </Text>

              <Pressable onPress={() => openModal('add')} style={({ pressed }) => [s.addBtn, pressed && { opacity: 0.92 }]}>
                <Text style={s.addBtnText}>Add note</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(it) => it.id}
              contentContainerStyle={{
                paddingHorizontal: sidePad,
                paddingTop: 14,
                paddingBottom: listBottomPad,
              }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => openModal('edit', item)}
                  onLongPress={() => deleteEntry(item)}
                  style={{ marginBottom: 12 }}
                >
                  <View style={[s.card, { width: cardW }]}>
                    <View style={s.cardTop}>
                      <View style={s.thumbWrap}>
                        {item.photoUri ? (
                          <Image source={{ uri: item.photoUri }} style={s.thumb} resizeMode="cover" />
                        ) : (
                          <View style={s.thumbEmpty}>
                            <Text style={s.thumbEmptyText}>📷</Text>
                          </View>
                        )}
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text numberOfLines={1} style={[s.cardTitle, { fontSize: isSmall ? 14 : 15 }]}>
                          {item.name?.trim() ? item.name : 'Untitled'}
                        </Text>
                        <Text style={s.cardDate}>{fmtDate(item.createdAt)}</Text>
                        <Text numberOfLines={3} style={s.cardNotes}>
                          {item.notes?.trim() ? item.notes : '—'}
                        </Text>
                        <Text style={s.cardHint}>Tap to edit • Long-press to delete</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              )}

              ListFooterComponent={
                <View style={{ alignItems: 'center', marginTop: 6 }}>
                  <Pressable
                    onPress={() => openModal('add')}
                    style={({ pressed }) => [s.addBtnWide, { width: cardW }, pressed && { transform: [{ scale: 0.995 }] }]}
                  >
                    <Text style={s.addBtnWideText}>Add note</Text>
                  </Pressable>
                </View>
              }
            />
          )}
        </Animated.View>
      </SafeAreaView>

      <Modal transparent visible={modalVisible} animationType="none" onRequestClose={closeModal}>
        <View style={s.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />

          <Animated.View
            style={[
              s.modalCard,
              {
                width: modalCardW,
                maxHeight: cardMaxH,
                padding: modalPad,
                opacity: mOpacity,
                transform: [{ translateY: mShift }, { scale: mScale }],
              },
            ]}
          >
            <View style={{ width: '100%', maxHeight: contentMaxH }}>
              <ScrollView
                ref={modalScrollRef}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 14 }}
              >
                <Text style={[s.modalTitle, { fontSize: isSmall ? 30 : 34 }]}>Trail Journal</Text>

                <Pressable
                  onPress={pickPhoto}
                  onLongPress={removePhoto}
                  style={[s.photoBox, { width: photoSize, height: photoSize, alignSelf: 'center' }]}
                >
                  {photoUri ? (
                    <Image source={{ uri: photoUri }} style={s.photo} resizeMode="cover" />
                  ) : (
                    <View style={s.photoPlaceholder}>
                      <Text style={s.cameraIcon}>📷</Text>
                    </View>
                  )}
                </Pressable>

                <View style={{ height: isSmall ? 14 : 16 }} />

                <Pressable onPress={focusName} style={[s.inputPill, { height: inputH }]}>
                  {!name && focused !== 'name' ? <Text style={s.inlineLabel}>Name</Text> : null}
                  <TextInput
                    ref={nameRef}
                    value={name}
                    onChangeText={(v) => {
                      setName(v);
                      const p = v.length;
                      setSelName({ start: p, end: p });
                    }}
                    style={[s.input, { fontSize: isSmall ? 16 : 18 }]}
                    autoCapitalize="none"
                    autoCorrect={false}
                    caretHidden={false}
                    selectionColor="#FFFFFF"
                    selection={selName}
                    onSelectionChange={(e) => setSelName(e.nativeEvent.selection)}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused((f) => (f === 'name' ? null : f))}
                    showSoftInputOnFocus={false}
                  />
                </Pressable>

                <View style={{ height: 12 }} />

                <Pressable onPress={focusNotes} style={[s.notesPill, { height: notesH }]}>
                  {!notes && focused !== 'notes' ? (
                    <Text style={[s.inlineLabel, { top: Platform.select({ ios: 12, android: 10 }) }]}>Notes</Text>
                  ) : null}
                  <TextInput
                    ref={notesRef}
                    value={notes}
                    onChangeText={(v) => {
                      setNotes(v);
                      const p = v.length;
                      setSelNotes({ start: p, end: p });
                    }}
                    style={[s.input, s.notesInput, { fontSize: isSmall ? 16 : 18 }]}
                    multiline
                    textAlignVertical="top"
                    autoCapitalize="none"
                    caretHidden={false}
                    selectionColor="#FFFFFF"
                    selection={selNotes}
                    onSelectionChange={(e) => setSelNotes(e.nativeEvent.selection)}
                    onFocus={() => setFocused('notes')}
                    onBlur={() => setFocused((f) => (f === 'notes' ? null : f))}
                    showSoftInputOnFocus={false}
                  />
                </Pressable>

                <View style={{ height: isSmall ? 16 : 18 }} />

                <View style={s.actions}>
                  <Pressable onPress={closeModal} style={({ pressed }) => [s.cancelBtn, pressed && { opacity: 0.75 }]}>
                    <Text style={[s.cancelText, { fontSize: isSmall ? 20 : 22 }]}>Cancel</Text>
                  </Pressable>

                  <Pressable
                    onPress={saveEntry}
                    disabled={!canSave}
                    style={({ pressed }) => [
                      s.saveBtn,
                      !canSave && { opacity: 0.55 },
                      pressed && canSave && { transform: [{ scale: 0.99 }] },
                    ]}
                  >
                    <Text style={[s.saveText, { fontSize: isSmall ? 20 : 22 }]}>Save</Text>
                  </Pressable>
                </View>

                <Text style={s.hint}>Tap Name/Notes to show keyboard • Photo optional • Long-press photo to remove</Text>
              </ScrollView>
            </View>

            {showKeyboard ? CustomKeyboard : null}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  safe: { flex: 1 },
  bg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  dark: { ...StyleSheet.absoluteFillObject, backgroundColor: '#071021', opacity: 0.22 },
  layer: { flex: 1 },

  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  hTitle: { color: '#fff', fontWeight: '900', letterSpacing: 0.2 },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 90 },
  emptyImg: { opacity: 0.95 },
  emptyTitle: { color: '#fff', fontWeight: '900' },
  emptySub: { marginTop: 6, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 18 },

  addBtn: {
    marginTop: 16,
    height: 48,
    borderRadius: 999,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF8A00',
  },
  addBtnText: { color: '#08143C', fontWeight: '900', fontSize: 16 },

  card: {
    borderRadius: 18,
    backgroundColor: 'rgba(10,35,95,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    padding: 12,
  },
  cardTop: { flexDirection: 'row', gap: 12 },
  thumbWrap: {
    width: 78,
    height: 78,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(22, 54, 150, 0.55)',
  },
  thumb: { width: '100%', height: '100%' },
  thumbEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  thumbEmptyText: { fontSize: 22, opacity: 0.9 },

  cardTitle: { color: '#fff', fontWeight: '900' },
  cardDate: { marginTop: 2, color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: '700' },
  cardNotes: { marginTop: 8, color: 'rgba(255,255,255,0.78)', fontSize: 12, lineHeight: 16 },
  cardHint: { marginTop: 8, color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: '700' },

  addBtnWide: {
    height: 54,
    borderRadius: 999,
    backgroundColor: '#FF8A00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnWideText: { color: '#08143C', fontWeight: '900', fontSize: 16 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  modalCard: {
    borderRadius: 34,
    backgroundColor: 'rgba(5, 18, 70, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
    alignItems: 'center',
  },
  modalTitle: { color: '#FFF', fontWeight: '900', letterSpacing: 0.2, textAlign: 'center' },

  photoBox: {
    marginTop: 16,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: 'rgba(22, 54, 150, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cameraIcon: { fontSize: 28 },

  inputPill: {
    width: '100%',
    borderRadius: 999,
    backgroundColor: 'rgba(22, 54, 150, 0.65)',
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  notesPill: {
    width: '100%',
    borderRadius: 26,
    backgroundColor: 'rgba(22, 54, 150, 0.65)',
    paddingHorizontal: 18,
    paddingTop: Platform.select({ ios: 12, android: 10 }),
    paddingBottom: Platform.select({ ios: 10, android: 10 }),
  },

  inlineLabel: {
    position: 'absolute',
    left: 18,
    top: Platform.select({ ios: 14, android: 12 }),
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '800',
    fontSize: 18,
  },

  input: {
    color: '#FFF',
    fontWeight: '700',
    paddingVertical: Platform.select({ ios: 12, android: 8 }),
  },
  notesInput: { paddingTop: 0, paddingBottom: 0 },

  actions: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 14 },
  cancelBtn: { height: 54, borderRadius: 999, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: 'rgba(170,190,255,0.9)', fontWeight: '800' },
  saveBtn: {
    flex: 1,
    height: 54,
    borderRadius: 999,
    backgroundColor: 'rgba(35, 56, 95, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: { color: '#FFF', fontWeight: '900' },

  hint: { marginTop: 10, color: 'rgba(255,255,255,0.55)', fontSize: 11, textAlign: 'center' },

  kbWrap: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: 'rgba(8,20,60,0.48)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    marginTop: 10,
  },
  kbTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  kbTitle: { color: 'rgba(255,255,255,0.85)', fontWeight: '900', fontSize: 12, letterSpacing: 0.2 },
  kbTarget: { color: 'rgba(255,255,255,0.55)', fontWeight: '800', fontSize: 11 },

  kbRow: { flexDirection: 'row', gap: 6 },
  kbKey: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kbKeyText: { color: 'rgba(255,255,255,0.92)', fontWeight: '900', fontSize: 12 },

  kbFunc: {
    width: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kbFuncText: { color: 'rgba(255,255,255,0.92)', fontWeight: '900', fontSize: 12 },

  kbSpace: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kbSpaceText: { color: 'rgba(255,255,255,0.9)', fontWeight: '900', fontSize: 12 },

  kbAction: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kbActionText: { color: 'rgba(255,255,255,0.9)', fontWeight: '900', fontSize: 12 },

  kbOk: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255,138,0,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kbOkText: { color: '#08143C', fontWeight: '900', fontSize: 12 },

  kbHint: { marginTop: 10, color: 'rgba(255,255,255,0.55)', fontSize: 10, lineHeight: 13 },
});