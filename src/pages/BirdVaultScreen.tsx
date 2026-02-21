import React, { useMemo, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  TextInput,
  Animated,
  Easing,
  Share,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BIRD_ARTICLES } from './birdVaultContent';

const BG = require('../gallery/launch_bg.png');

const birdImages = {
  bird_01: require('../gallery/bird_01.png'),
  bird_02: require('../gallery/bird_02.png'),
  bird_03: require('../gallery/bird_03.png'),
  bird_04: require('../gallery/bird_04.png'),
  bird_05: require('../gallery/bird_05.png'),
  bird_06: require('../gallery/bird_06.png'),
  bird_07: require('../gallery/bird_07.png'),
  bird_08: require('../gallery/bird_08.png'),
  bird_09: require('../gallery/bird_09.png'),
  bird_10: require('../gallery/bird_10.png'),
  bird_11: require('../gallery/bird_11.png'),
  bird_12: require('../gallery/bird_12.png'),
  bird_13: require('../gallery/bird_13.png'),
  bird_14: require('../gallery/bird_14.png'),
  bird_15: require('../gallery/bird_15.png'),
} as const;

type BirdItem = {
  id: string;
  name: string;
  latin: string;
  imageKey: keyof typeof birdImages;
  articleId: string;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

type ParsedBird = {
  scientificName: string;
  mapPin: string;
  habitat: string;
  size: string;
  description: string;
};

function parseBirdBody(body: string): ParsedBird {
  const lines = body
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const scientificName = (lines.find((l) => l.toLowerCase().startsWith('scientific name:')) || '')
    .replace(/^Scientific name:\s*/i, '')
    .trim();

  const mapPin = (lines.find((l) => l.toLowerCase().startsWith('map pin')) || '')
    .replace(/^Map pin \(example\):\s*/i, '')
    .replace(/^Map pin:\s*/i, '')
    .trim();

  const habitat = (lines.find((l) => l.toLowerCase().startsWith('common habitat:')) || '')
    .replace(/^Common habitat:\s*/i, '')
    .trim();

  const size = (lines.find((l) => l.toLowerCase().startsWith('size:')) || '')
    .replace(/^Size:\s*/i, '')
    .trim();

  const idx = lines.findIndex((l) => l.toLowerCase().startsWith('detailed description:'));
  let description = '';
  if (idx >= 0) description = lines.slice(idx + 1).join(' ').trim();
  else description = lines.slice(1).join(' ').trim();

  return { scientificName, mapPin, habitat, size, description };
}

const BIRD_VAULT_GRID: BirdItem[] = Array.from({ length: 15 }).map((_, i) => {
  const n = String(i + 1).padStart(2, '0');
  const imageKey = `bird_${n}` as keyof typeof birdImages;
  const article = BIRD_ARTICLES.find((a) => a.id === n);
  const parsed = article ? parseBirdBody(article.body) : null;

  return {
    id: `bv-${n}`,
    name: article?.title ?? `Bird ${n}`,
    latin: parsed?.scientificName || '—',
    imageKey,
    articleId: n,
  };
});

export default function BirdVaultScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isSmall = height <= 700;

  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<BirdItem | null>(null);

  const t = useRef(new Animated.Value(0)).current;

  const DATA: BirdItem[] = useMemo(() => BIRD_VAULT_GRID, []);

  useFocusEffect(
    useCallback(() => {
      setQ('');
      setSelected(null);
      t.stopAnimation();
      t.setValue(0);
      return () => {};
    }, [t])
  );

  const filtered = useMemo(() => {
    const sQuery = q.trim().toLowerCase();
    if (!sQuery) return DATA;

    return DATA.filter((b) => {
      const article = BIRD_ARTICLES.find((a) => a.id === b.articleId);
      const parsed = article ? parseBirdBody(article.body) : null;
      const hay = `${b.name} ${b.latin} ${parsed?.habitat ?? ''} ${parsed?.mapPin ?? ''}`.toLowerCase();
      return hay.includes(sQuery);
    });
  }, [q, DATA]);

  const openDetail = (bird: BirdItem) => {
    setSelected(bird);
    t.stopAnimation();
    t.setValue(0);
    Animated.timing(t, {
      toValue: 1,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeDetail = () => {
    Animated.timing(t, {
      toValue: 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setSelected(null);
    });
  };

  const article = selected ? BIRD_ARTICLES.find((a) => a.id === selected.articleId) : null;
  const parsed = article ? parseBirdBody(article.body) : null;

  const onShare = async () => {
    if (!selected || !article || !parsed) return;
    try {
      await Share.share({
        message:
          `${selected.name}\n` +
          `Scientific name: ${parsed.scientificName}\n` +
          `Map pin: ${parsed.mapPin}\n` +
          `Common habitat: ${parsed.habitat}\n` +
          `Size: ${parsed.size}\n\n` +
          `${parsed.description}`,
      });
    } catch {}
  };

  const sidePad = isSmall ? 14 : 16;
  const gridGap = isSmall ? 10 : 12;

  const usableW = width - sidePad * 2;
  const cardW = Math.floor((usableW - gridGap) / 2);
  const cardH = clamp(Math.round(cardW * (isSmall ? 1.22 : 1.26)), 180, 270);
  const imgAreaH = Math.round(cardH * 0.72);
  const contentBottomPad = insets.bottom + (isSmall ? 118 : 130);

  const heroH = clamp(
    Math.round((height - insets.top - insets.bottom) * (isSmall ? 0.34 : 0.38)),
    220,
    360
  );

  const listOpacity = t.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const listShift = t.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  const detailOpacity = t.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const detailShift = t.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });

  return (
    <View style={s.root}>
      <Image source={BG} style={s.bg} resizeMode="cover" />
      <View style={s.dark} />

      <Animated.View
        pointerEvents={selected ? 'none' : 'auto'}
        style={[s.layer, { opacity: listOpacity, transform: [{ translateY: listShift }] }]}
      >
        <View style={{ paddingTop: insets.top + 10 }} />

        <View style={[s.headerRow, { paddingHorizontal: sidePad }]}>
          <Text style={[s.hTitle, { fontSize: isSmall ? 15 : 16 }]}>Bird Vault</Text>
        </View>

        <View style={{ paddingHorizontal: sidePad, marginTop: isSmall ? 8 : 10 }}>
          <View style={[s.search, { height: isSmall ? 34 : 36 }]}>
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Search birds..."
              placeholderTextColor="rgba(255,255,255,0.45)"
              style={[s.searchInput, { fontSize: isSmall ? 11 : 12 }]}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            <View style={s.searchIcon}>
              <Text style={s.searchIconText}>⌕</Text>
            </View>
          </View>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(it) => it.id}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: sidePad,
            paddingTop: 12,
            paddingBottom: contentBottomPad,
          }}
          columnWrapperStyle={{ gap: gridGap }}
          renderItem={({ item }) => (
            <Pressable onPress={() => openDetail(item)} style={{ marginBottom: gridGap }}>
              <View style={[s.card, { width: cardW, height: cardH }]}>
                <View style={[s.cardImgFrame, { height: imgAreaH }]}>
                  <Image source={birdImages[item.imageKey]} style={s.cardImg} resizeMode="contain" />
                </View>

                <View style={s.cardInfo}>
                  <Text numberOfLines={1} style={[s.cardName, { fontSize: isSmall ? 10.5 : 11 }]}>
                    {item.name}
                  </Text>
                  <Text numberOfLines={1} style={[s.cardLatin, { fontSize: isSmall ? 9 : 9.5 }]}>
                    {item.latin}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      </Animated.View>

      {selected && article && parsed && (
        <Animated.View
          pointerEvents="auto"
          style={[s.layer, { opacity: detailOpacity, transform: [{ translateY: detailShift }] }]}
        >
          <View style={{ paddingTop: insets.top + 10 }} />

          <View style={[s.detailTop, { paddingHorizontal: sidePad }]}>
            <Pressable onPress={closeDetail} style={s.backBtn}>
              <Text style={s.backText}>‹</Text>
            </Pressable>

            <Text style={[s.detailTitle, { fontSize: isSmall ? 13 : 14 }]} numberOfLines={1}>
              {selected.name}
            </Text>

            <Pressable onPress={onShare} style={s.shareBtn}>
              <Text style={s.shareText}>↗</Text>
            </Pressable>
          </View>

          <FlatList
            data={[selected]}
            keyExtractor={() => selected.id}
            contentContainerStyle={{
              paddingHorizontal: sidePad,
              paddingTop: 12,
              paddingBottom: contentBottomPad,
            }}
            renderItem={() => (
              <>
                <View style={s.heroCard}>
                  <View style={[s.heroFrame, { height: heroH }]}>
                    <Image source={birdImages[selected.imageKey]} style={s.heroImg} resizeMode="contain" />
                  </View>
                </View>

                <View style={s.detailBlock}>
                  <Text style={[s.birdName, { fontSize: isSmall ? 15 : 16 }]}>{selected.name}</Text>
                  <Text style={[s.birdLatin, { fontSize: isSmall ? 10 : 10.5 }]}>{parsed.scientificName}</Text>

                  <View style={s.metaBlock}>
                    <Text style={s.metaLine}>
                      <Text style={s.metaKey}>Map pin: </Text>
                      <Text style={s.metaVal}>{parsed.mapPin}</Text>
                    </Text>

                    <Text style={s.metaLine}>
                      <Text style={s.metaKey}>Common habitat: </Text>
                      <Text style={s.metaVal}>{parsed.habitat}</Text>
                    </Text>

                    <Text style={s.metaLine}>
                      <Text style={s.metaKey}>Size: </Text>
                      <Text style={s.metaVal}>{parsed.size}</Text>
                    </Text>
                  </View>

                  <Text style={[s.articleTitle, { fontSize: isSmall ? 12.5 : 13 }]}>
                    Detailed description
                  </Text>

                  <Text
                    style={[
                      s.articleText,
                      { fontSize: isSmall ? 10.5 : 11, lineHeight: isSmall ? 15.5 : 16.8 },
                    ]}
                  >
                    {parsed.description}
                  </Text>
                </View>
              </>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  bg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  dark: { ...StyleSheet.absoluteFillObject, backgroundColor: '#071021', opacity: 0.22 },
  layer: { ...StyleSheet.absoluteFillObject },

  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hTitle: { color: '#fff', fontWeight: '800', letterSpacing: 0.2 },

  search: {
    borderRadius: 999,
    backgroundColor: 'rgba(8,20,60,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingLeft: 12,
    paddingRight: 42,
    justifyContent: 'center',
  },
  searchInput: { color: '#fff', paddingVertical: Platform.select({ ios: 8, android: 6 }) },
  searchIcon: {
    position: 'absolute',
    right: 8,
    top: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  searchIconText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '800' },

  card: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(10,35,95,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  cardImgFrame: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  cardImg: { width: '100%', height: '100%' },

  cardInfo: { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 12 },
  cardName: { color: '#fff', fontWeight: '800' },
  cardLatin: { marginTop: 2, color: '#FF8A00', fontWeight: '700' },

  detailTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(8,20,60,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: '#fff', fontSize: 18, fontWeight: '900', marginTop: -2 },
  detailTitle: { flex: 1, color: '#fff', fontWeight: '800' },
  shareBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF8A00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareText: { color: '#08143C', fontSize: 14, fontWeight: '900' },

  heroCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(10,35,95,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  heroFrame: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  heroImg: { width: '100%', height: '100%' },

  detailBlock: {
    marginTop: 12,
    backgroundColor: 'rgba(10,35,95,0.75)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 12,
  },

  birdName: { color: '#fff', fontWeight: '900' },
  birdLatin: { marginTop: 2, color: '#FF8A00', fontWeight: '800' },

  metaBlock: {
    marginTop: 10,
    padding: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  metaLine: { marginTop: 6, color: 'rgba(255,255,255,0.86)', fontSize: 11 },
  metaKey: { color: 'rgba(255,255,255,0.7)', fontWeight: '800' },
  metaVal: { color: 'rgba(255,255,255,0.9)', fontWeight: '700' },

  articleTitle: { marginTop: 12, color: '#fff', fontWeight: '900' },
  articleText: { marginTop: 8, color: 'rgba(255,255,255,0.82)' },
});